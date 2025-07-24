import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { AirComponentConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option: any = {
  dataset: 19,
  bg_png: 1,
  title: 'PM2.5',
  title_size: 16,
  title_color: '#FFFFFF99',
  data_size: 32,
  data_color: '#FFFFFFFF',
  unit: 'μg/m³',
  unit_size: 24,
  unit_color: '#FFFFFF99',
  conditions: 100,
  icon_size: 22,
  icon_text_size: 16,
  decimal: 0
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = AirComponentConfig.key
  public attr = { ...chartInitConfig, w: 416, h: 270, zIndex: 1 }
  public chartConfig = cloneDeep(AirComponentConfig)
  public option = cloneDeep(option)
}
