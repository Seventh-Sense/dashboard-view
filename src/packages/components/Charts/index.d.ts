import i18n from '@/i18n/index'

/* eslint-disable no-unused-vars */
export enum ChatCategoryEnum {
  BAR = 'Bars',
  PIE = 'Pies',
  LINE = 'Lines',
  SCATTER = 'Scatters',
  MAP = 'Maps',
  MORE = 'Mores',
  Gauge = 'Gauges',
  Device = 'Devices',
  Air = 'AirConditioner',
}

export enum ChatCategoryEnumName {
  BAR = '柱状图',
  PIE = '饼图',
  LINE = '折线图',
  SCATTER = '散点图',
  MAP = '地图',
  COMBINATION = '组合图',
  MORE = () => window['$t']('dashboard.more'),
  Gauge = () => window['$t']('dashboard.gauge'),
  Device = () => window['$t']('dashboard.device'),
  Air = () => window['$t']('dashboard.input'),
}

export const PROPERTY_TYPE_MAP = () => {
  const t = window['$t']

  return t('device.object_name')
}
