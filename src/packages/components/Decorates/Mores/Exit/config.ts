import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { chartInitConfig } from '@/settings/designSetting'
import { ExitConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  size: 96,
  type: 1,
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = ExitConfig.key
  public attr = { ...chartInitConfig, w: 96, h: 96, zIndex: -1 }
  public chartConfig = cloneDeep(ExitConfig)
  public option = cloneDeep(option)
}
