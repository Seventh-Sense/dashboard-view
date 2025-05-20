import { RouteRecordRaw } from 'vue-router'
import { PageEnum } from '@/enums/pageEnum'
import i18n from '@/i18n/index'

// 引入路径
const importPath = {
  'PageEnum.BASE_HOME_NAME': () => import('@/views/project/index.vue'),
  'PageEnum.BASE_HOME_ITEMS_NAME': () => import('@/views/project/items/index.vue'),
  'PageEnum.BASE_LOCAL_NAME': () => import('@/page/Home/index.vue'),
  'PageEnum.BASE_LOCAL_MAN_NAME': () => import('@/page/ObjectManage/LocalObject/index.vue'),
  'PageEnum.BASE_REMOTE_MAN_NAME': () => import('@/page/ObjectManage/RemoteObject/index.vue'),
  'PageEnum.BASE_MODBUS_MAN_NAME': () => import('@/page/ObjectManage/Modbus/index.vue'),
  'PageEnum.BASE_HOME_TEMPLATE_NAME': () => import('@/views/project/mtTemplate/index.vue'),
  'PageEnum.BASE_HOME_TEMPLATE_MARKET_NAME': () =>
    import('@/views/project/templateMarket/index.vue')
}

const projectRoutes: RouteRecordRaw = {
  path: PageEnum.BASE_HOME,
  name: PageEnum.BASE_HOME_NAME,
  component: importPath['PageEnum.BASE_HOME_NAME'],
  redirect: PageEnum.BASE_HOME_ITEMS,
  meta: {
    title: 'XPlay',
    isRoot: true
  },
  children: [
    {
      path: PageEnum.BASE_LOCAL,
      name: PageEnum.BASE_LOCAL_NAME,
      component: importPath['PageEnum.BASE_LOCAL_NAME'],
      meta: {
        title: 'XPlay'
      }
    },
    {
      path: PageEnum.BASE_LOCAL_MAN,
      name: PageEnum.BASE_LOCAL_MAN_NAME,
      component: importPath['PageEnum.BASE_LOCAL_MAN_NAME'],
      meta: {
        title: 'XPlay'
      }
    },
    {
      path: PageEnum.BASE_REMOTE_MAN,
      name: PageEnum.BASE_REMOTE_MAN_NAME,
      component: importPath['PageEnum.BASE_REMOTE_MAN_NAME'],
      meta: {
        title: 'XPlay'
      }
    },
    {
      path: PageEnum.BASE_MODBUS_MAN,
      name: PageEnum.BASE_MODBUS_MAN_NAME,
      component: importPath['PageEnum.BASE_MODBUS_MAN_NAME'],
      meta: {
        title: 'XPlay'
      }
    },
    {
      path: PageEnum.BASE_HOME_ITEMS,
      name: PageEnum.BASE_HOME_ITEMS_NAME,
      component: importPath['PageEnum.BASE_HOME_ITEMS_NAME'],
      meta: {
        title: 'XPlay'
      }
    },
    {
      path: PageEnum.BASE_HOME_TEMPLATE,
      name: PageEnum.BASE_HOME_TEMPLATE_NAME,
      component: importPath['PageEnum.BASE_HOME_TEMPLATE_NAME'],
      meta: {
        title: 'XPlay'
      }
    },
    {
      path: PageEnum.BASE_HOME_TEMPLATE_MARKET,
      name: PageEnum.BASE_HOME_TEMPLATE_MARKET_NAME,
      component: importPath['PageEnum.BASE_HOME_TEMPLATE_MARKET_NAME'],
      meta: {
        title: 'XPlay'
      }
    }
  ]
}

export default projectRoutes
