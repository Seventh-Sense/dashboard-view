import { ResultEnum } from '@/enums/httpEnum'

export enum ChartEnum {
  // 图表创建
  CHART_HOME = '/chart/home/:id(.*)*',
  CHART_HOME_NAME = 'ChartHome'
}

export enum PreviewEnum {
  //  图表预览
  CHART_PREVIEW = '/chart/preview/:id(.*)*',
  CHART_PREVIEW_NAME = 'ChartPreview'
}

export enum EditEnum {
  //  图表JSON编辑
  CHART_EDIT = '/chart/edit/:id(.*)*',
  CHART_EDIT_NAME = 'ChartEdit'
}

export enum PageEnum {
  // 登录
  BASE_LOGIN = '/login',
  BASE_LOGIN_NAME = 'Login',

  //重定向
  REDIRECT = '/redirect',
  REDIRECT_NAME = 'Redirect',
  RELOAD = '/reload',
  RELOAD_NAME = 'Reload',

  // 首页
  BASE_HOME = '/project',
  BASE_HOME_NAME = 'Project',

  // 我的项目
  BASE_HOME_ITEMS = '/project/items',
  BASE_HOME_ITEMS_NAME = 'Project-Items',

  //smart Lab
  BASE_LOCAL = '/local',
  BASE_LOCAL_NAME = 'Local',

  BASE_Object_MAN_NAME = 'Object',

  BASE_LOCAL_MAN = '/object/local',
  BASE_LOCAL_MAN_NAME = 'Local-Object',

  BASE_REMOTE_MAN = '/object/remote',
  BASE_REMOTE_MAN_NAME = 'Remote-Object',

  BASE_MODBUS_MAN = '/object/modbus',
  BASE_MODBUS_MAN_NAME = 'Modbus-Object',

  // 我的模板
  BASE_HOME_TEMPLATE = '/project/my-template',
  BASE_HOME_TEMPLATE_NAME = 'Project-My-Template',

  // 模板市场
  BASE_HOME_TEMPLATE_MARKET = '/project/template-market',
  BASE_HOME_TEMPLATE_MARKET_NAME = 'Project-Template-Market',

  // 错误
  ERROR_PAGE_NAME_403 = 'ErrorPage403',
  ERROR_PAGE_NAME_404 = 'ErrorPage404',
  ERROR_PAGE_NAME_500 = 'ErrorPage500',


  //display
  BASE_DISPLAY = '/display',
  BASE_DISPLAY_NAME = 'Display',

  //device manage
  BASE_DEVICE_MANAGE = '/devicemanage',
  BASE_DEVICE_MANAGE_NAME = 'DeviceManage',
}

export const ErrorPageNameMap = new Map([
  [ResultEnum.NOT_FOUND, PageEnum.ERROR_PAGE_NAME_404],
  [ResultEnum.SERVER_FORBIDDEN, PageEnum.ERROR_PAGE_NAME_403],
  [ResultEnum.SERVER_ERROR, PageEnum.ERROR_PAGE_NAME_500]
])
