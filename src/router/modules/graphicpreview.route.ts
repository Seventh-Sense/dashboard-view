import { RouteRecordRaw } from 'vue-router'
import { GraphicPreviewEnum } from '@/enums/pageEnum'

// 引入路径
const importPath = {
  'GraphicPreviewEnum.CHART_GRAPHIC_PREVIEW_NAME': () => import('@/page/GraphicPreview/index.vue')
}

const graphicPreviewRoutes: RouteRecordRaw = {
  path: GraphicPreviewEnum.CHART_GRAPHIC_PREVIEW,
  name: GraphicPreviewEnum.CHART_GRAPHIC_PREVIEW_NAME,
  component: importPath['GraphicPreviewEnum.CHART_GRAPHIC_PREVIEW_NAME'],
  meta: {
    title: 'XPlay',
    isRoot: true
  }
}


export default graphicPreviewRoutes