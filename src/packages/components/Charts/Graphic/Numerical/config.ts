import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { NumericalConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option: any = {
  dataset: 36,
  backgroundColor: '#00000088',
  fontSize: 16,
  title: '温度',
  textColor: '#FFFFFF99',
  rightIconSize: 36,
  iconNo: 1,
  dataSize: 32,
  dataColor: '#FFFFFFEE',
  unitText: '℃',
  bottomTextSize: 16,
  bottomTextColor: '#AAAAAA',
  isUnit: true,
  isStatus: false,
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = NumericalConfig.key
  public attr = { ...chartInitConfig, w: 116, h: 152, zIndex: 1 }
  public chartConfig = cloneDeep(NumericalConfig)
  public option = cloneDeep(option)
}
