import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { ModeControlConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option: any = {
  dataset: 0,
  inactive_bgColor: '#FFFFFF12',
  active_bgColor: '#6666FFFF',
  icon: 'meeting',
  icon_size: 140,
  radius: 6,
  filter: 32,
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = ModeControlConfig.key
  public attr = { ...chartInitConfig, w: 380, h: 348, zIndex: 1 }
  public chartConfig = cloneDeep(ModeControlConfig)
  public option = cloneDeep(option)
}
