import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { DigitFrameConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export interface OptionType {
    dataset: any
}

export const units = [
  {
    label: '-',
    value: ''
  },
  {
    label: '℃',
    value: '℃'
  },
  {
    label: '%',
    value: '%'
  },
  {
    label: 'mg/m3',
    value: 'mg/m3'
  },
  {
    label: 'μg/m3',
    value: 'μg/m3'
  },
  {
    label: 'ppm',
    value: 'ppm'
  },
  {
    label: 'Pa',
    value: 'Pa'
  }
]

export const option = {
    dataset: 40,
    size: 32,
    color: '#FFFFFF87',
    unit: ''
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = DigitFrameConfig.key
  public attr = { ...chartInitConfig, w: 50, h: 50, zIndex: 1 }
  public chartConfig = cloneDeep(DigitFrameConfig)
  public option = cloneDeep(option)
}