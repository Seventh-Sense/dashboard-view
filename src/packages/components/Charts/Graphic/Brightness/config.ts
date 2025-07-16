import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { BrightnessConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option = {
  dataset: 30,
  thumb_color: 'white',
  track_color: 'rgba(102, 102, 255, 1)',
  percent_color: 'white',
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = BrightnessConfig.key
  public attr = { ...chartInitConfig, w: 283, h: 56, zIndex: 1 }
  public chartConfig = cloneDeep(BrightnessConfig)
  public option = cloneDeep(option)
}