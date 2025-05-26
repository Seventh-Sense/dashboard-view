import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { ModeConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option = {
  dataset: '0',
  modes: ['0', '1']
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = ModeConfig.key
  public attr = { ...chartInitConfig, w: 80, h: 80, zIndex: 1 }
  public chartConfig = cloneDeep(ModeConfig)
  public option = cloneDeep(option)
}