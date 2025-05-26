import { JSONParse, JSONStringify, getSessionStorage } from '@/utils'
import { StorageEnum } from '@/enums/storageEnum'
import { ChartEditStorage } from '@/store/modules/chartEditStore/chartEditStore.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { readProject } from '@/api/http'

const chartEditStore = useChartEditStore()

export interface ChartEditStorageType extends ChartEditStorage {
  id: string
}

// 根据路由 id 获取存储数据的信息
export const getSessionStorageInfo = () => {
  const urlHash = document.location.hash
  const toPathArray = urlHash.split('/')
  const id = toPathArray && toPathArray[toPathArray.length - 1]

  const storageList: ChartEditStorageType[] = getSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST)
 
  if (storageList) {
    for (let i = 0; i < storageList.length; i++) {
      if (id.toString() === storageList[i]['id']) {
        const { editCanvasConfig, requestGlobalConfig, componentList } = storageList[i]
        chartEditStore.editCanvasConfig = editCanvasConfig
        chartEditStore.requestGlobalConfig = requestGlobalConfig
        chartEditStore.componentList = componentList
        return storageList[i]
      }
    }
  }

  chartEditStore.setInitCanves();
}

//演示获取本地数据
// export const getLocalStorageInfo = () => {
//   const filedata = JSONParse(JSONStringify(dataJson))

//   //console.log(filedata)
//   chartEditStore.editCanvasConfig = filedata.editCanvasConfig
//   chartEditStore.requestGlobalConfig = filedata.requestGlobalConfig
//   chartEditStore.componentList = filedata.componentList
// }

//预览 读取后端数据
export const getPreviewInfo = () => {
  const urlHash = document.location.hash
  const toPathArray = urlHash.split('/')
  const id = toPathArray && toPathArray[toPathArray.length - 1]

  readProject(id)
    .then((res: any) => {
      if (res.status === 'OK' && res.data.content !== '') {
        let data = JSONParse(res.data.content)
        chartEditStore.editCanvasConfig = data.editCanvasConfig
        chartEditStore.requestGlobalConfig = data.requestGlobalConfig
        chartEditStore.componentList = data.componentList
      }
    })
    .catch(err => {
      console.log(err)
    })
}


function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}