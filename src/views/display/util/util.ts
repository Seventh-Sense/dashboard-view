import { getDeviceList, readPointValue } from '@/api/http'

export const IntervalTimeOut = 3000

//获取所有需要读取数据的点位
export const getAllDataIdsSafe = (points: any[]): string[] => {
  return [
    ...new Set(
      points.map(com => com.request?.bindParams?.objectID).filter(Boolean) // 过滤 null/undefined/空字符串
    )
  ]
}

export const writeValue = (componentList: any, data: any) => {
  componentList.map((component: any) => {
    const { deviceID, objectID } = component.request.bindParams

    const matchedData = data.find((item: any) => item.metric_id === objectID)

    if (!matchedData) return

    //console.log(matchedData.property?.['present-value'])
    if (component.key === 'Online') {
      component.option.timestamp = Date.now()
      component.option.dataset = matchedData.status
    } else if (component.key === 'Image') {
      component.option.timestamp = Date.now()
      component.option.datavalue = matchedData.value
    } else {
      component.option.timestamp = Date.now()
      component.option.dataset = matchedData.value
    }
  })
  //console.log(chartEditStore.componentList)

  return componentList
}

/**
 * 获取绑定参数并补充到数据列表中
 * @param dataList 原始数据列表
 * @returns 处理后的数槐列表
 */
export const getBindParams = async (dataList: any[]) => {
  console.log('原始数据列表:', dataList)

  const bindPoints: any[] = []
  const uniqueKeys = new Set<string>()

  for (const data of dataList) {
    const { deviceID, objectID } = data.request.bindParams
    const uniqueKey = `${deviceID}|${objectID}`

    if (!uniqueKeys.has(uniqueKey)) {
      uniqueKeys.add(uniqueKey)
      bindPoints.push({
        device_id: deviceID,
        object_id: objectID
      })
    } else {
      //console.log(`跳过重复绑定点: device_id=${deviceID}, object_id=${objectID}`)
    }
  }

  const processedPoints = await handleBinding(bindPoints)

  //console.log('处理后的绑定点:', processedPoints)

  return dataList.map(data => {
    const matchPoint = processedPoints.find(
      point =>
        point.device_id === data.request.bindParams.deviceID &&
        point.object_id === data.request.bindParams.objectID
    )
    return {
      ...data,
      request: {
        ...data.request,
        bindInfo: matchPoint
      }
    }
  })
}

/**
 * 处理绑定逻辑，获取设备信息并补充绑定点属性
 * @param bindPoints 原始绑定点列表
 * @returns 处理后的绑定点列表
 */
const handleBinding = async (bindPoints: any[]) => {
  try {
    const res: any = await getDeviceList()

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      return bindPoints
    }

    // 补充设备类型信息（使用map而非修改原数组）
    const pointsWithDeviceType = bindPoints.map(point => {
      const deviceInfo = res.data.find((device: any) => device.id === point.device_id)
      //console.log('匹配设备信息:', deviceInfo, res)
      return {
        ...point,
        device_type: deviceInfo?.protocol || 'unknown',
        address: deviceInfo?.address || ''
      }
    })

    // 处理不同协议类型的点位，并行执行异步操作
    const processedPoints = await Promise.all(
      pointsWithDeviceType.map(async point => {
        // 根据设备类型补充协议特定属性
        switch (point.device_type) {
          case 'bacnet':
            const bacnetProperty = await handleBacnetBinding(point)
            return { ...point, property: bacnetProperty }

          case 'modbus':
            // TODO: modbus协议处理逻辑
            return { ...point, property: {} }

          case 'opcua':
            // TODO: opcua协议处理逻辑
            return { ...point, property: {} }

          case 'knx':
            // TODO: knx协议处理逻辑
            return { ...point, property: {} }

          default:
            return { ...point }
        }
      })
    )

    return processedPoints
  } catch (e) {
    console.error('Failed to fetch devices:', e)
    return bindPoints
  }
}

/**
 * 处理BACnet点位绑定，获取优先级和标识符
 * @param point 点位信息
 * @returns 包含优先级的Promise对象
 */
const handleBacnetBinding = async (point: any) => {
  const DEFAULT_PRIORITY = 16 // 默认优先级

  try {
    const res = await readPointValue(point.device_id)

    if (!res.data?.length) {
      return { priority: DEFAULT_PRIORITY }
    }

    const load = res.data.find((item: any) => item.metric_id === point.object_id)
    if (!load) {
      return { priority: DEFAULT_PRIORITY }
    }

    //console.log('Bacnet点位数据:', load)

    // 获取优先级数组
    const priorityArray = load.property['priority-array']
    let priority = DEFAULT_PRIORITY

    if (priorityArray) {
      const validPriority = Object.entries(priorityArray).find(([_, val]) => val !== null)
      priority = validPriority ? Number(validPriority[0]) : DEFAULT_PRIORITY
    }

    // 获取对象标识符
    const objUid = load.property['object-identifier']
    let uid: string | undefined
    if (objUid !== null && objUid !== undefined) {
      if (Array.isArray(objUid)) {
        uid = objUid.join(',')
      } else {
        // 如果是字符串或数字，直接转为字符串
        uid = String(objUid)
      }
    }

    return { priority, uid }
  } catch (error) {
    console.error('Error fetching priority:', error)
    return { priority: DEFAULT_PRIORITY }
  }
}
