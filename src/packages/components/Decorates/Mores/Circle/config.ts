import {  PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { CircleConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option = {
  backgroundColor: '#FFFFFF21',
  borderColor: '#FFFFFF21',
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = CircleConfig.key
  public attr = { ...chartInitConfig, w: 70, h: 70, zIndex: 1 }
  public chartConfig = cloneDeep(CircleConfig)
  public option = cloneDeep(option)
}