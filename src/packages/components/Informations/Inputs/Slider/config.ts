import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { SliderConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export interface OptionType {
    dataset: boolean
}

export const option = {
    dataset: 40,
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = SliderConfig.key
  public attr = { ...chartInitConfig, w: 150, h: 40, zIndex: 1 }
  public chartConfig = cloneDeep(SliderConfig)
  public option = cloneDeep(option)
}