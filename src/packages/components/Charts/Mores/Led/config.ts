import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { LedConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export interface OptionType {
    dataset: number | string
}

export const option: OptionType = {
    dataset: 10,
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = LedConfig.key
  public attr = { ...chartInitConfig, w: 150, h: 150, zIndex: 1 }
  public chartConfig = cloneDeep(LedConfig)
  public option = cloneDeep(option)
}
