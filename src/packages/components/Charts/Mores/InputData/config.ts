import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { InputDataConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option = {
  dataset: 40,
  is_edit: false,
  showbutton: false,
  icon_color: '#fff',
  color: '#fff',
  size: 26,
  decimal: 0,
  border_width: 1,
  border_color: '#666',
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = InputDataConfig.key
  public attr = { ...chartInitConfig, w: 220, h: 48, zIndex: 1 }
  public chartConfig = cloneDeep(InputDataConfig)
  public option = cloneDeep(option)
}
