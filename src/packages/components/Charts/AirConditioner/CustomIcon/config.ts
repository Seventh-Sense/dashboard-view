import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { CustomIconConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option = {
    dataset: '0',
    icon: 'pause',
    icon_size: 24,
    avtive_value: '1',
    inavtive_value: '0',
    avtive_background: '#6666FFFF',
    inavtive_background: '#FFFFFF21',
    border_color: '#FFFFFF21',
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = CustomIconConfig.key
  public attr = { ...chartInitConfig, w: 48, h: 48, zIndex: 1 }
  public chartConfig = cloneDeep(CustomIconConfig)
  public option = cloneDeep(option)
}