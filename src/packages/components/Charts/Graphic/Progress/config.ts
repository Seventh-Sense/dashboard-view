import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { ProgressConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'
import i18n from '@/i18n/index'

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

export const option = {
  dataset: 60,
  color: ['#F76F83FF', '#6666FFFF'],
  minValue: 0,
  maxValue: 100,
  showInfo: false,
  linecap: "round",
  height: 20
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = ProgressConfig.key
  public attr = { ...chartInitConfig, w: 200, h: 30, zIndex: 1 }
  public chartConfig = cloneDeep(ProgressConfig)
  public option = cloneDeep(option)
}
