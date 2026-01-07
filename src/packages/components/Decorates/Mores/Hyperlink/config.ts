import {  PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { HyperlinkConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option = {
  background_0: '#00CED1FF',
  background_100: '#6666FFFF',
  borderColor: '#FFFFFF21',
  text: 'Hyperlink',
  href: 'https://www.baidu.com',
  fontSize: 20,
  fontColor: '#ffffff',
  radius: 8,
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = HyperlinkConfig.key
  public attr = { ...chartInitConfig, w: 150, h: 70, zIndex: 1 }
  public chartConfig = cloneDeep(HyperlinkConfig)
  public option = cloneDeep(option)
}