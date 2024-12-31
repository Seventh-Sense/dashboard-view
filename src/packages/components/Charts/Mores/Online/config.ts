import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { OnlineConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { chartInitConfig } from '@/settings/designSetting'

export const option = {
    dataset: false,
    //在线颜色
    onlineColor: '#00CED1FF',
    //离线颜色
    offlineColor: '#F76F83FF',
    //大小
    size: 10,
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = OnlineConfig.key
  public attr = { ...chartInitConfig, w: 50, h: 50, zIndex: 1 }
  public chartConfig = cloneDeep(OnlineConfig)
  public option = cloneDeep(option)
}