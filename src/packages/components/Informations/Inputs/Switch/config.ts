import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { SwitchConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option = {
  off: '#000000',
  on: '#6666FF',
  dataset: false
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = SwitchConfig.key
  public attr = { ...chartInitConfig, w: 80, h: 40, zIndex: 1 }
  public chartConfig = cloneDeep(SwitchConfig)
  public option = cloneDeep(option)
}
