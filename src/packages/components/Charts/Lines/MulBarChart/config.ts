import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { MulBarChartConfig } from './index'
import { CreateComponentType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'


export const option = {
  
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key: string = MulBarChartConfig.key
  public attr = { ...chartInitConfig, w: 600, h: 300, zIndex: 1 }
  public chartConfig = cloneDeep(MulBarChartConfig)
  // 图表配置项
  public option = cloneDeep(option)
}