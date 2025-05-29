import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { SpeedConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option = {
  dataset: '0',
  size: 72,
  speeds: ['0', '1', '2', '3']
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = SpeedConfig.key
  public attr = { ...chartInitConfig, w: 80, h: 80, zIndex: 1 }
  public chartConfig = cloneDeep(SpeedConfig)
  public option = cloneDeep(option)
}
