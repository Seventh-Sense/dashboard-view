import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { RadioConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option: any = {
  dataset: '0',
  background: '#222222FF',
  active_color: '#FFFFFFFF',
  inactive_color: '#FFFFFF33',
  on_text: 'ON',
  on_contant: '1',
  off_text: 'OFF',
  off_contant: '0',
  on_font_size: 16,
  off_font_size: 16,
  active_bg_color: '#6666FFFF',
  inactive_bg_color: '#FFFFFF12',
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = RadioConfig.key
  public attr = { ...chartInitConfig, w: 275, h: 67, zIndex: 1 }
  public chartConfig = cloneDeep(RadioConfig)
  public option = cloneDeep(option)
}