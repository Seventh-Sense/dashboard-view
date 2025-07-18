import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { ModeGroupConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option = {
  dataset: '0',
  modes: [
    {
      title: '自动',
      icon: 'auto',
      value: '0'
    },
    {
      title: '制热',
      icon: 'sun',
      value: '1'
    },
    {
      title: '制冷',
      icon: 'snow',
      value: '2'
    },
    {
      title: '吹风',
      icon: 'fan2',
      value: '3'
    }
  ],
  title_size: 12,
  title_color: '#FFFFFFFF',
  icon_size: 70,
  icon_bottom_color: '#FFFFFF21',
  border_color: '#FFFFFF21'

}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = ModeGroupConfig.key
  public attr = { ...chartInitConfig, w: 516, h: 158, zIndex: 1 }
  public chartConfig = cloneDeep(ModeGroupConfig)
  public option = cloneDeep(option)
}
