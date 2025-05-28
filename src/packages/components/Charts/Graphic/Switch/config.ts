import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { SwitchConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option = {
  off: '#FFFFFF',
  on: '#6666FF',
  dataset: false
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = SwitchConfig.key
  public attr = { ...chartInitConfig, w: 80, h: 80, zIndex: 1 }
  public chartConfig = cloneDeep(SwitchConfig)
  public option = cloneDeep(option)
}
