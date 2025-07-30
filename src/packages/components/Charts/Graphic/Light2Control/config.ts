import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { Light2ControlConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'
import led_on from '@/assets/led_on.png'
import led_off from '@/assets/led_off.png'

export const option: any = {
  dataset: 0,
  backgroundColor: '#00000087',
  radius: 6,
  filter: 32,
  top_title_size: 16,
  top_title: '',
  top_title_color: '#FFFFFFFF',
  switch_w: 51,
  switch_h: 24,
  image_switch: true,
  image_on: led_on,
  image_off: led_off,
  image_w: 156,
  image_h: 248,
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Light2ControlConfig.key
  public attr = { ...chartInitConfig, w: 316, h: 380, zIndex: 1 }
  public chartConfig = cloneDeep(Light2ControlConfig)
  public option = cloneDeep(option)
}