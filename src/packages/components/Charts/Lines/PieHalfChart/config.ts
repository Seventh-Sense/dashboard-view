import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { PieHalfChartConfig } from './index'
import { CreateComponentType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'


export const option = {
  
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key: string = PieHalfChartConfig.key
  public attr = { ...chartInitConfig, w: 600, h: 300, zIndex: 1 }
  public chartConfig = cloneDeep(PieHalfChartConfig)
  // 图表配置项
  public option = cloneDeep(option)
}