import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { RadioConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option: any = {
  dataset: 0,
  background: '#222222FF'
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = RadioConfig.key
  public attr = { ...chartInitConfig, w: 275, h: 67, zIndex: 1 }
  public chartConfig = cloneDeep(RadioConfig)
  public option = cloneDeep(option)
}