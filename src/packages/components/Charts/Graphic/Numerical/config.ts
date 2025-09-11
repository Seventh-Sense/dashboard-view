import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { NumericalConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option: any = {
  dataset: 26,
  backgroundColor: '#00000088',
  fontSize: 32,
  title: '',
  textColor: '#FFFFFF99',
  rightIconSize: 72,
  iconNo: 1,
  dataSize: 64,
  dataColor: '#FFFFFFEE',
  unitText: '℃',
  bottomTextSize: 32,
  bottomTextColor: '#AAAAAA',
  isUnit: true,
  isStatus: false,
  decimal: 0
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = NumericalConfig.key
  public attr = { ...chartInitConfig, w: 232, h: 304, zIndex: 1 }
  public chartConfig = cloneDeep(NumericalConfig)
  public option = cloneDeep(option)
}
