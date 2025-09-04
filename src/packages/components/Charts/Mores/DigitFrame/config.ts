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
  },
  {
    label: '%RH',
    value: '%RH'
  }
]

export const decimals = [
  {
    label: '0',
    value: 0
  },
  {
    label: '1',
    value: 1
  },
  {
    label: '2',
    value: 2
  },
  {
    label: '3',
    value: 3
  }
]

export const option = {
  dataset: 40,
  size: 20,
  color: '#FFFFFFFF',
  unit: '',
  decimal: 0,
  title_switch: false,
  title_text: '当前值:',
  textAlign: 'center',
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = DigitFrameConfig.key
  public attr = { ...chartInitConfig, w: 120, h: 50, zIndex: 1 }
  public chartConfig = cloneDeep(DigitFrameConfig)
  public option = cloneDeep(option)
}
