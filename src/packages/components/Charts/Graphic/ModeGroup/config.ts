import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { ModeGroupConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option = {
  dataset: '0',
  modes: [
    {
      title: window['$t']('dashboard.auto_title'),
      icon: 'auto',
      value: '0'
    },
    {
      title: window['$t']('dashboard.sun_title'),
      icon: 'sun',
      value: '1'
    },
    {
      title: window['$t']('dashboard.snow_title'),
      icon: 'snow',
      value: '2'
    },
    {
      title: window['$t']('dashboard.fan2_title'),
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
