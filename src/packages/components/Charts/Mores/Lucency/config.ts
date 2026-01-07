import {  PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { LucencyConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option = {
  backgroundColor: 'transparent',
  radius: 0,
  dataset: 0,
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = LucencyConfig.key
  public attr = { ...chartInitConfig, w: 150, h: 70, zIndex: 1 }
  public chartConfig = cloneDeep(LucencyConfig)
  public option = cloneDeep(option)
}