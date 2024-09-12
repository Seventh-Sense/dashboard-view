import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const MotorDeviceConfig: ConfigType = {
  key: 'MotorDevice',
  chartKey: 'VMotorDevice',
  conKey: 'VCMotorDevice',
  title: '设备',
  category: ChatCategoryEnum.Device,
  categoryName: ChatCategoryEnumName.Device,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image: 'dial.png'
}