import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { ConditionerConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option: any = {
  dataset: 26,
  onOff: true,
  setTemp: 36,
  mode: 1,
  speed: 2,
  backgroundColor: '#00000088',
  title: '空调',
  titleColor: '#FFFFFF99',
  titleSize: 16,
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = ConditionerConfig.key
  public attr = { ...chartInitConfig, w: 182, h: 208, zIndex: 1 }
  public chartConfig = cloneDeep(ConditionerConfig)
  public option = cloneDeep(option)
}