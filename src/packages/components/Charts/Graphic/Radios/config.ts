import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { RadiosConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option: any = {
  dataset: 0,
  background: '#222222FF',
  active_color: '#FFFFFFFF',
  inactive_color: '#FFFFFF33',
  active_bg_color: '#6666FFFF',
  inactive_bg_color: '#FFFFFF12',
  modes: [
    {
      key: 'Option 1',
      label: '自动',
      value: 0,
    },
    {
      key: 'Option 2',
      label: '低',
      value: 1,
    },
    {
      key: 'Option 3',
      label: '中',
      value: 2,
    },
    {
      key: 'Option 4',
      label: '高',
      value: 3,
    }
  ]
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = RadiosConfig.key
  public attr = { ...chartInitConfig, w: 544, h: 40, zIndex: 1 }
  public chartConfig = cloneDeep(RadiosConfig)
  public option = cloneDeep(option)
}