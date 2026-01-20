import { JSONParse, JSONStringify, getSessionStorage } from '@/utils'
import { StorageEnum } from '@/enums/storageEnum'
import { ChartEditStorage } from '@/store/modules/chartEditStore/chartEditStore.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { readProject } from '@/api/http'
import localforage from '@/utils/localforage'

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

  chartEditStore.setInitCanves()
}

//清空数据
export const clearStorage = () => {
  chartEditStore.setInitCanves()
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
  return new Promise(async (resolve, reject) => {
    try {
      const urlHash = document.location.hash
      const toPathArray = urlHash.split('/')
      const id = toPathArray && toPathArray[toPathArray.length - 1]

      if (!id) {
        return reject(new Error('获取预览信息失败：URL哈希中未解析到有效ID'))
      }

      const list: any = await localforage.getItem('ProjectList')

      if (!Array.isArray(list) || list.length === 0) {
        return reject(new Error('获取预览信息失败：本地无项目列表数据'))
      }

      const matchItem = list.find(element => element?.id === id)
      if (!matchItem) {
        return reject(new Error(`获取预览信息失败：未找到ID为【${id}】的项目`))
      }

      let data = JSONParse(matchItem.content)

      chartEditStore.editCanvasConfig = data.editCanvasConfig || {}
      chartEditStore.requestGlobalConfig = data.requestGlobalConfig || {}
      chartEditStore.componentList = data.componentList || []

      resolve(data)
    } catch (error) {
      console.error('获取预览信息异常：', error)
      reject(error)
    }
  })
}

//传入参数，获取数据
// export const getPreviewInfoByInfo = (load: string) => {
//   if (load === '') {
//     chartEditStore.setInitCanves()
//     return
//   }

//   let data = JSONParse(load)
//   chartEditStore.editCanvasConfig = data.editCanvasConfig
//   chartEditStore.requestGlobalConfig = data.requestGlobalConfig
//   chartEditStore.componentList = data.componentList
// }

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
