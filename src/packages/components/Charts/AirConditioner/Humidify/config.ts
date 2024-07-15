import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { HumidifyConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export interface OptionType {
    dataset: boolean
}

export const option: OptionType = {
    dataset: true,
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = HumidifyConfig.key
  public attr = { ...chartInitConfig, w: 150, h: 150, zIndex: 1 }
  public chartConfig = cloneDeep(HumidifyConfig)
  public option = cloneDeep(option)
}