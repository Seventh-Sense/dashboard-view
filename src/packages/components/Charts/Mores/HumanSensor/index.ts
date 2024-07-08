import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const HumanSensorConfig: ConfigType = {
  key: 'HumanSensor',
  chartKey: 'VHumanSensor',
  conKey: 'VCHumanSensor',
  title: '人在传感器',
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'humansensor.png'
}