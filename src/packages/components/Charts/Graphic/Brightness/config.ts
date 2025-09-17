import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { BrightnessConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option = {
  dataset: 30,
  background_color: '#FFFFFF33',
  thumb_color: '#FFFFFFFF',
  track_color: '#6666FFFF',
  percent_color: '#FFFFFFFF',
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = BrightnessConfig.key
  public attr = { ...chartInitConfig, w: 283, h: 56, zIndex: 1 }
  public chartConfig = cloneDeep(BrightnessConfig)
  public option = cloneDeep(option)
}