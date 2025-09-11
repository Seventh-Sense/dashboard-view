import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { HumidityChartConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option: any = {
  dataset: 80,
  backgroundColor: '#00000088',
  fontSize: 32,
  title: '湿度',
  textColor: '#FFFFFF99',
  rightIconSize: 72,
  iconNo: 1,
  dataSize: 32,
  dataColor: '#FFFFFFEE',
  unitText: '℃',
  bottomTextSize: 16,
  bottomTextColor: '#AAAAAA',
  decimal: 0,
  min: 0,
  max: 100,
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = HumidityChartConfig.key
  public attr = { ...chartInitConfig, w: 305, h: 170, zIndex: 1 }
  public chartConfig = cloneDeep(HumidityChartConfig)
  public option = cloneDeep(option)
}