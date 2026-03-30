import { getDeviceList, readPointValue, readSubscribePoints } from '@/api/http'
import { getLocalStorage } from '@/utils'

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

//"0c0b17ae-4677-40f2-891b-ff3931e95860"
//获取点位信息和规则
export const getInfos = async () => {
  try {
    const res: any = await getDeviceList()

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      return []
    }

    const deviceList = res.data
    let points: any[] = []

    for (const device of deviceList) {
      try {
        const pointRes: any = await readSubscribePoints(device.id)

        if (pointRes.status !== 'OK') {
          console.warn(`设备 ${device.id} 获取点位失败，状态：`, pointRes.status)
          continue // 单个设备失败，跳过，不影响整体
        }

        if (Array.isArray(pointRes.data)) {
          points.push(...pointRes.data)
        }
      } catch (err) {
        console.error(`设备 ${device.id} 获取点位异常：`, err)
        continue
      }
    }

    console.log('最终整合的所有点位数据：', points)
    return points
  } catch (e) {
    console.error('Failed to fetch devices:', e)
    return []
  }
}

/*
{
    "metric_id": "0c0b17ae-4677-40f2-891b-ff3931e95860",
    "value": null,
    "status": 0,
    "timestamp": 1774317086
}
*/
export const readValue = (pointIds: any[], pointList: any[]) => {
  console.log('read value', pointIds, pointList)

  if (!Array.isArray(pointIds) || !Array.isArray(pointList)) {
    console.warn('data 或 points 不是数组')
    return []
  }

  return pointIds.map(pointId => {
    // 查找匹配的点位
    const matchedPoint = pointList.find(item => item.id === pointId)

    // 默认数据结构
    const defaultData = {
      metric_id: pointId,
      value: 0,
      status: 1,
      timestamp: 1774317086
    }

    if (!matchedPoint) return defaultData

    // 解析描述中的数值范围，格式：数字-数字
    const { description = '' } = matchedPoint
    const [min, max] = parseRange(description)

    let decimalPlaces = 0

    if (matchedPoint.property?.parms?.count) {
      const count = Number(matchedPoint.property.parms.count)
      // 确保是合法数字
      if (!isNaN(count) && count >= 0) {
        decimalPlaces = count
      }
    }

    // 校验解析结果，不合法则使用默认值
    if (isNaN(min) || isNaN(max) || min > max) {
      console.warn(`点位 ${pointId} 描述格式不正确，无法拆分范围: ${description}`)
      defaultData.value = getRandomInt(0, 100, decimalPlaces)
    } else {
      defaultData.value = getRandomInt(min, max, decimalPlaces)
    }

    console.log('test', defaultData, min, max)
    

    return defaultData
  })
}

/**
 * 解析字符串中的数字范围 如 "10.5-50.8" → [10.5, 50.8]（支持整数/小数）
 * @param description 待解析的描述字符串
 * @returns 解析后的 [最小值, 最大值]
 */
const parseRange = (description: string): [number, number] => {
  // 正则修改：支持整数、小数（正数）
  const match = description.match(/^(\d+\.?\d*)-(\d+\.?\d*)$/)
  return match ? [Number(match[1]), Number(match[2])] : [NaN, NaN]
}

/**
 * 生成指定范围的随机数（支持整数 / 指定位数小数）
 * @param min 最小值
 * @param max 最大值
 * @param decimalPlaces 保留小数位数，默认 0（整数）
 * @returns 随机数
 */
const getRandomInt = (min: number, max: number, decimalPlaces: number = 0): number => {
  // 转数字并处理非法值
  min = Number(min);
  max = Number(max);

  // 如果是 NaN，给默认值 0
  if (isNaN(min)) min = 0;
  if (isNaN(max)) max = 0;

  // 交换大小，防止顺序错误
  if (min > max) [min, max] = [max, min];

  // 限制小数位 >= 0
  decimalPlaces = Math.max(0, Math.floor(Number(decimalPlaces)) || 0);

  // 生成随机数
  const randomValue = Math.random() * (max - min) + min;

  // 指定位数四舍五入
  if (decimalPlaces === 0) {
    return Math.floor(randomValue);
  } else {
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.round(randomValue * multiplier) / multiplier;
  }
};
