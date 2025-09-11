import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { BarChartConfig } from './index'
import { CreateComponentType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'


export const option = {
  
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key: string = BarChartConfig.key
  public attr = { ...chartInitConfig, w: 600, h: 300, zIndex: 1 }
  public chartConfig = cloneDeep(BarChartConfig)
  // 图表配置项
  public option = cloneDeep(option)
}
