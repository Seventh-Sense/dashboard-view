import type { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { DisplayRoute, RedirectRoute } from '@/router/base'
import { createRouterGuards } from './router-guards'
import { PageEnum } from '@/enums/pageEnum'
import { HttpErrorPage, LoginRoute, ReloadRoute } from '@/router/base'
import { Layout } from '@/router/constant'

import modules from '@/router/modules'

const RootRoute: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Root',
    redirect: PageEnum.BASE_LOGIN,
    component: Layout,
    meta: {
      title: 'Root',
    },
    children: [
      ...HttpErrorPage,
      modules.projectRoutes,
      modules.chartRoutes,
      modules.previewRoutes,
      modules.editRoutes
    ]
  },
  {
    path: '/display',
    name: 'Display',
    redirect: PageEnum.BASE_DISPLAY,
    component: Layout,
    meta: {
      title: 'Display',
    },
  }
]


export const constantRouter: any[] = [LoginRoute, ...RootRoute, RedirectRoute, ReloadRoute, DisplayRoute];

const router = createRouter({
  history: createWebHashHistory(''),
  routes: constantRouter,
  strict: true,
})

export function setupRouter(app: App) {
  app.use(router);
  // 创建路由守卫
  createRouterGuards(router)
}
export default router
