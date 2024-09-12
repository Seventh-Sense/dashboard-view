import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { SwitchConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const sizeOptions = [
  {
    label: 'Small',
    value: 'small'
  },
  {
    label: 'Medium',
    value: 'medium'
  },
  {
    label: 'Large',
    value: 'large'
  }
]

export const roundOptions = [
  {
    label: 'Round',
    value: true
  },
  {
    label: 'Square',
    value: false
  }
]

export const option = {
  size: 'medium',
  //是否为圆形按钮
  round: true,
  disabled: false,
  dataset: true
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = SwitchConfig.key
  public attr = { ...chartInitConfig, w: 80, h: 40, zIndex: 1 }
  public chartConfig = cloneDeep(SwitchConfig)
  public option = cloneDeep(option)
}
