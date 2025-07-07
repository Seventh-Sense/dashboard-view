import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { LightControlConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'
import logo from '@/assets/images/exception/image-404.png'

export const option: any = {
  dataset: '0',
  backgroundColor: '#00000087',
  top_title_size: 16,
  top_title: '灯1',
  top_title_color: '#FFFFFFFF',
  tip_content: '宽边线型灯',
  tip_color: '#FFFFFF99',
  tip_size: 16,
  switch_h: 66,
  switch_bg_color: '#222222FF',
  on_text: 'ON',
  off_text: 'OFF',
  on_contant: '1',
  off_contant: '0',
  on_url: logo,
  off_url: logo,
  image_w: 182,
  image_h: 250,
  active_color: '#FFFFFFFF',
  inactive_color: '#FFFFFF33',
  active_bg_color: '#6666FFFF',
  inactive_bg_color: '#FFFFFF12',
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = LightControlConfig.key
  public attr = { ...chartInitConfig, w: 303, h: 418, zIndex: 1 }
  public chartConfig = cloneDeep(LightControlConfig)
  public option = cloneDeep(option)
}