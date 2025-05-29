import { RouteRecordRaw } from 'vue-router'
import { GraphicEnum } from '@/enums/pageEnum'

// 引入路径
const importPath = {
  'GraphicEnum.CHART_GRAPHIC_NAME': () => import('@/page/Graphic/index.vue')
}

const graphicRoutes: RouteRecordRaw = {
  path: GraphicEnum.CHART_GRAPHIC,
  name: GraphicEnum.CHART_GRAPHIC_NAME,
  component: importPath['GraphicEnum.CHART_GRAPHIC_NAME'],
  meta: {
    title: 'XPlay',
    isRoot: true,
    noKeepAlive: true,
  }
}


export default graphicRoutes