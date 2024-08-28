import { ref } from 'vue'
import { ChartEnum, PreviewEnum } from '@/enums/pageEnum'
import { fetchPathByName, routerTurnByPath } from '@/utils'
import { Chartype } from '../../../index.d'

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

    routerTurnByPath(path, [cardData.id], undefined, false)
  }

  return {
    modalData,
    modalShow,
    closeModal,
    resizeHandle,
    editHandle,
    previewHandle,
  }
}
