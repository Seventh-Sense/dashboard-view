import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { SwitchTwoConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option: any = {
  dataset: 0,
  on_color1: '',
  on_color2: '',
  off_color1: '',
  off_color2: '',
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = SwitchTwoConfig.key
  public attr = { ...chartInitConfig, w: 100, h: 56, zIndex: 1 }
  public chartConfig = cloneDeep(SwitchTwoConfig)
  public option = cloneDeep(option)
}