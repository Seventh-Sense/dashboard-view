import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { ConferenceSceneConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export interface OptionType {
  dataset: any
}

export const option = {
  dataset: '1',
  inactive_bgColor: '#FFFFFF12',
  active_bgColor: '#6666FFFF',
  icon_size: 140,
  radius: 6,
  filter: 32,
  x_gap: 110,
  y_gap: 80,
  padding: 80,
  icon_w: 380,
  icon_h: 348,
  title_size: 20,
  title_color: '#FFFFFF',
  modes: [
    {
      key: '1',
      icon: 'meeting',
      value: '1',
      title: '开会模式',
    },
    {
      key: '2',
      icon: 'projector',
      value: '0',
      title: '投影模式',
    },
    {
      key: '3',
      icon: 'podium',
      value: '4',
      title: '宣讲模式',
    },
    {
      key: '4',
      icon: 'rest',
      value: '5',
      title: '离场模式',
    },
    {
      key: '5',
      icon: 'film',
      value: '2',
      title: '观影模式',
    },
    {
      key: '6',
      icon: 'shutdown',
      value: '3',
      title: '全关模式',
    }
  ]
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = ConferenceSceneConfig.key
  public attr = { ...chartInitConfig, w: 1640, h: 936, zIndex: 1 }
  public chartConfig = cloneDeep(ConferenceSceneConfig)
  public option = cloneDeep(option)
}
