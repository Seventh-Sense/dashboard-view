import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const WaterSensorConfig: ConfigType = {
  key: 'WaterSensor',
  chartKey: 'VWaterSensor',
  conKey: 'VCWaterSensor',
  title: '水浸传感器',
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'watersensor.png'
}