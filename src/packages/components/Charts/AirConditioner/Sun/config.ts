import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { SunConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option = {
  dataset: 0,
  on_value: 1
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = SunConfig.key
  public attr = { ...chartInitConfig, w: 80, h: 80, zIndex: 1 }
  public chartConfig = cloneDeep(SunConfig)
  public option = cloneDeep(option)
}
