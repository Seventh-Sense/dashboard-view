import { ref } from 'vue'
import { ChartEnum, PreviewEnum } from '@/enums/pageEnum'
import {
  fetchPathByName,
  getLocalStorage,
  JSONParse,
  routerTurnByPath,
  setSessionStorage
} from '@/utils'
import { Chartype } from '../../../index.d'
import { readProject } from '@/api/http'
import { StorageEnum } from '@/enums/storageEnum'

export const useModalDataInit = () => {
  const modalShow = ref<boolean>(false)
  const modalData = ref<Chartype | null>(null)

  // 关闭 modal
  const closeModal = () => {
    modalShow.value = false
    modalData.value = null
  }

  // 放大
  const resizeHandle = (cardData: Chartype) => {
    if (!cardData) return
    modalShow.value = true
    modalData.value = cardData
  }

  // 编辑
  const editHandle = (cardData: Chartype) => {
    if (!cardData) return
    const path = fetchPathByName(ChartEnum.CHART_HOME_NAME, 'fullPath')

    routerTurnByPath(path, [cardData.id], undefined, false)
  }

  // 预览
  const previewHandle = (cardData: Chartype) => {
    if (!cardData) return
    const path = fetchPathByName(PreviewEnum.CHART_PREVIEW_NAME, 'fullPath')

    let id = cardData.id.toString()

    //读取数据并写入sessionStorageInfo
    readProject(cardData.id)
      .then((res: any) => {
        if (res && res.content !== '') {
          let data = JSONParse(res.content)
          const sessionStorageInfo = getLocalStorage(StorageEnum.GO_CHART_STORAGE_LIST) || []
          if (sessionStorageInfo?.length) {
            const repeateIndex = sessionStorageInfo.findIndex(
              (e: { id: string }) => e.id === cardData.id
            )

            if (repeateIndex !== -1) {
              sessionStorageInfo.splice(repeateIndex, 1, { id: id, ...data })
            } else {
              sessionStorageInfo.push({
                id: id,
                ...data
              })
              setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, sessionStorageInfo)
            }
          } else {
            setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, [{ id: id, ...data }])
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        routerTurnByPath(path, [cardData.id], undefined, false)
      })
  }

  return {
    modalData,
    modalShow,
    closeModal,
    resizeHandle,
    editHandle,
    previewHandle
  }
}
