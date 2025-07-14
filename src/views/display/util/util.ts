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
      component.option.dataset = matchedData.status
    } else if (component.key === 'Image') {
      component.option.datavalue = matchedData.value
    } else {
      component.option.dataset = matchedData.value
    }
  })
  //console.log(chartEditStore.componentList)

  return componentList
}
