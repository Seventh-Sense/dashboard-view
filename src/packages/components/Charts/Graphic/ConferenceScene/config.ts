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
  mode_num: 6,
  modes_6: [
    {
      key: '1',
      icon: 'meeting',
      value: '1',
      title: ''
    },
    {
      key: '2',
      icon: 'projector',
      value: '0',
      title: ''
    },
    {
      key: '3',
      icon: 'podium',
      value: '4',
      title: ''
    },
    {
      key: '4',
      icon: 'rest',
      value: '5',
      title: ''
    },
    {
      key: '5',
      icon: 'film',
      value: '2',
      title: ''
    },
    {
      key: '6',
      icon: 'shutdown',
      value: '3',
      title: ''
    }
  ],
  modes_4: [
    {
      key: '1',
      icon: 'home',
      value: '1',
      title: ''
    },
    {
      key: '2',
      icon: 'meeting',
      value: '2',
      title: ''
    },
    {
      key: '3',
      icon: 'shutdown',
      value: '3',
      title: ''
    },
    {
      key: '4',
      icon: 'shutdown',
      value: '5',
      title: ''
    }
  ],
  modes_3: [
    {
      key: '1',
      icon: 'home',
      value: '1',
      title: '日常模式'
    },
    {
      key: '2',
      icon: 'meeting',
      value: '2',
      title: '会客模式'
    },
    {
      key: '3',
      icon: 'display',
      value: '3',
      title: '沙盘模式'
    }
  ],
  modes_2: [
    {
      key: '1',
      icon: 'home',
      value: '1',
      title: ''
    },
    {
      key: '2',
      icon: 'meeting',
      value: '2',
      title: ''
    },
  ]
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = ConferenceSceneConfig.key
  public attr = { ...chartInitConfig, w: 1640, h: 936, zIndex: 1 }
  public chartConfig = cloneDeep(ConferenceSceneConfig)
  public option = cloneDeep(option)
}
