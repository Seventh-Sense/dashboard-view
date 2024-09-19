import { PublicConfigClass } from '@/packages/public'
import { MotorDeviceConfig } from './index'
import { CreateComponentType } from '@/packages/index.d'
import { chartInitConfig } from '@/settings/designSetting'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  dataset: false
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = MotorDeviceConfig.key
  public attr = { ...chartInitConfig, w: 300, h: 204, zIndex: 1 }
  public chartConfig = cloneDeep(MotorDeviceConfig)
  public option = cloneDeep(option)
}
