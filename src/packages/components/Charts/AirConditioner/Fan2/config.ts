import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { Fan2Config } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option = {
  dataset: 0,
  on_value: 1
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Fan2Config.key
  public attr = { ...chartInitConfig, w: 80, h: 80, zIndex: 1 }
  public chartConfig = cloneDeep(Fan2Config)
  public option = cloneDeep(option)
}
