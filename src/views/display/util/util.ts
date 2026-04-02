import { toString } from './../../../utils/type';
import { getDeviceList, readPointValue } from '@/api/http'
import { getLocalStorage, setLocalStorage } from '@/utils'

export const IntervalTimeOut = () => {
  let pollingTime = 3000

  try {
    let config = getLocalStorage('SettingData')

    if (
      config !== null &&
      config !== undefined &&
      typeof config === 'object' &&
      !Array.isArray(config)
    ) {
      if (config.polling_time !== undefined) {
        pollingTime = config.polling_time

        return pollingTime
      }
    }
  } catch (e) {
    console.error('加载配置时出错，未修改任何配置:', e)
  }

  return pollingTime
}

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

    const ddd = data.find((item: any) => item.tags === 'people_count')
    // console.log('ddd', ddd.value, new Date().toLocaleString())

    //console.log(matchedData.property?.['present-value'])
    if (component.key === 'Online') {
      component.option.timestamp = Date.now()
      component.option.dataset = matchedData.status
    } else if (component.key === 'Image') {
      
      if (component.request.bindInfo.device_type === 'ModbusTCP') {
        let value = getSwitchModeValue()

        component.option.timestamp = Date.now()
        component.option.datavalue = value
        //console.log('Image', value)
      } else {
        component.option.timestamp = Date.now()
        component.option.datavalue = matchedData.value
      }
    } else if (component.key === 'SwitchMode' || component.key === 'Enumerate') {
      let value = getSwitchModeValue()

      component.option.timestamp = Date.now()
      component.option.dataset = value
    } else {
      component.option.timestamp = Date.now()
      component.option.dataset = matchedData.value
    }
  })

  return componentList
}

const getSwitchModeValue = () => {
  let value = getLocalStorage('SwitchMode')

  //console.log('getSwitchModeValue', value)
  if (value) {
    return value
  } else {
    return 1
  }
}

export const setSwitchModeValue = (value: any) => {
  setLocalStorage('SwitchMode', value)
}

/**
 * 获取绑定参数并补充到数据列表中
 * @param dataList 原始数据列表
 * @returns 处理后的数槐列表
 */
export const getBindParams = async (dataList: any[]) => {
  //console.log('原始数据列表:', dataList)

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
      return {
        ...point,
        device_type: deviceInfo?.protocol || 'unknown',
        address: deviceInfo?.address || ''
      }
    })

    //仅筛选出device_type为bacnet且device_id非空的项
    const bacnetPoints = pointsWithDeviceType.filter(
      item => item.device_type === 'bacnet' && item.device_id !== ''
    )

    // 提取bacnet设备的唯一device_id
    const uniqueBacnetDeviceIds = [...new Set(bacnetPoints.map(item => item.device_id))]

    let loadData: any = {}
    if (uniqueBacnetDeviceIds.length > 0) {
      await Promise.all(
        uniqueBacnetDeviceIds.map(async deviceId => {
          const ress: any = await readPointValue(deviceId)
          if (ress.status === 'OK' && Array.isArray(ress.data) && ress.data.length > 0) {
            // 以device_id为key，存储对应数据，后续直接取值
            loadData[deviceId] = ress.data
          }
        })
      )
    }

    // 处理不同协议类型的点位，并行执行异步操作
    const processedPoints = await Promise.all(
      pointsWithDeviceType.map(point => {
        // 根据设备类型补充协议特定属性
        switch (point.device_type) {
          case 'bacnet':
            const deviceData = loadData[point.device_id]
            const bacnetProperty = deviceData
              ? handleBacnetBinding(point, deviceData)
              : { priority: 16 }

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

const handleBacnetBinding = (point: any, resData: any) => {
  const DEFAULT_PRIORITY = 16 // 默认优先级

  try {
    if (!Array.isArray(resData)) {
      return { priority: DEFAULT_PRIORITY }
    }

    const load = resData.find((item: any) => item.metric_id === point.object_id)
    if (!load) {
      return { priority: DEFAULT_PRIORITY }
    }

    // 获取优先级数组
    const priorityArray = load?.property?.['priority-array']
    let priority = DEFAULT_PRIORITY

    if (priorityArray) {
      const validPriority = Object.entries(priorityArray).find(([_, val]) => val !== null)
      priority = validPriority ? Number(validPriority[0]) : DEFAULT_PRIORITY
    }

    // 获取对象标识符
    const objUid = load?.property?.['object-identifier']
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
