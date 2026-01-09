import {  PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { EnumerateConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option: any = {
  dataset: '0',
  color: '#ffffff',
  fontSize: 24,
  textAlign: 'center',
  options: []
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = EnumerateConfig.key
  public attr = { ...chartInitConfig, w: 150, h: 70, zIndex: 1 }
  public chartConfig = cloneDeep(EnumerateConfig)
  public option = cloneDeep(option)
}