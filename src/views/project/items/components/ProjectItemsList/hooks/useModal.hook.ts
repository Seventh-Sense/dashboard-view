import { ref } from 'vue'
import { ChartEnum, PreviewEnum, GraphicEnum, GraphicPreviewEnum } from '@/enums/pageEnum'
import {
  fetchPathByName,
  getLocalStorage,
  getSessionStorage,
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
    let path: string

    if (cardData.type && cardData.type === 'graphic') {
      path = fetchPathByName(GraphicEnum.CHART_GRAPHIC_NAME, 'fullPath')
    } else {
      path = fetchPathByName(ChartEnum.CHART_HOME_NAME, 'fullPath')
    }

    routerTurnByPath(path, [cardData.id], undefined, false)
  }

  // 预览
  const previewHandle = (cardData: Chartype) => {
    const t = window['$t']
    if (!cardData) return

    let path: string
    if (cardData.type && cardData.type === 'graphic') {
      path = fetchPathByName(GraphicPreviewEnum.CHART_GRAPHIC_PREVIEW_NAME, 'fullPath')
    } else {
      path = fetchPathByName(PreviewEnum.CHART_PREVIEW_NAME, 'fullPath')
    }
    let id = cardData.id.toString()

    //读取数据并写入sessionStorageInfo
    readProject(cardData.id)
      .then((res: any) => {
        if (res.status === 'OK' && res.data.content !== '""') {
          let data = JSONParse(res.data.content)
          console.log('asdasd', res.data)

          const sessionStorageInfo = getSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST) || []
          if (sessionStorageInfo?.length) {
            const repeateIndex = sessionStorageInfo.findIndex((e: { id: string }) => e.id === id)

            if (repeateIndex !== -1) {
              sessionStorageInfo.splice(repeateIndex, 1, { id: id, ...data })
              setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, sessionStorageInfo)
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

          routerTurnByPath(path, [cardData.id], undefined, false)
        } else {
          window['$message'].success(t('msg.msg_error_8'))
        }
      })
      .catch(err => {
        console.log(err)
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
