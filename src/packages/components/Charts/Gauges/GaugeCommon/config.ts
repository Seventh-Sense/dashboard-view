import { PublicConfigClass } from '@/packages/public'
import { GaugeCommonConfig } from './index'
import { CreateComponentType } from '@/packages/index.d'
import { chartInitConfig } from '@/settings/designSetting'
import cloneDeep from 'lodash/cloneDeep'
import i18n from '@/i18n/index'

export const units = [
  {
    label: 'None',
    value: ''
  },
  {
    label: '℃',
    value: '℃'
  },
  {
    label: '%',
    value: '%'
  },
  {
    label: '%Rh',
    value: '%Rh'
  },
  {
    label: 'mg/m3',
    value: 'mg/m3'
  },
  {
    label: 'μg/m3',
    value: 'μg/m3'
  },
  {
    label: 'ppm',
    value: 'ppm'
  },
  {
    label: 'Pa',
    value: 'Pa'
  }
]

export const caps = [
  {
    label: i18n.global.t('dashboard.round'),
    value: 'round'
  },
  {
    label: i18n.global.t('dashboard.square'),
    value: 'square'
  },
]

export const decimals  = [
  {
    label: '0',
    value: 0
  },
  {
    label: '1',
    value: 1
  },
  {
    label: '2',
    value: 2
  },
  {
    label: '3',
    value: 3
  },
]

export const option = {
  dataset: 36,
  // data颜色
  dataColor: '#FFFFFFFF',
  // data字体大小
  dataSize: 32,
  // 默认类型
  type: 'dashboard',
  // 主颜色
  color: ['#F76F83FF', '#6666FFFF'],
  // 轨道颜色
  railColor: '#FFFFFF87',
  // 轨道宽度
  strokeWidth: 9,
  // 单位
  unit: '',
  // 单位颜色
  unitColor: '#FFFFFF87',
  // 单位字体大小
  unitSize: 24,
  minValue: 0,
  maxValue: 100,
  minColor: '#FFFFFF87',
  maxColor: '#FFFFFF87',
  minSize: 24,
  maxSize: 24,
  minLeft: 10,
  maxLeft: 5,
  minTop: -33,
  maxTop: -33,
  linecap: "round",
  isWrite: false,
  step: 1,
  isScale: false,
  decimal: 0,
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key: string = GaugeCommonConfig.key
  public attr = { ...chartInitConfig, w: 150, h: 150, zIndex: 1 }
  public chartConfig = cloneDeep(GaugeCommonConfig)
  // 图表配置项
  public option = cloneDeep(option)
}
