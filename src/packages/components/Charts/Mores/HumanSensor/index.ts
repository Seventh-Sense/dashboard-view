import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const HumanSensorConfig: ConfigType = {
  key: 'HumanSensor',
  chartKey: 'VHumanSensor',
  conKey: 'VCHumanSensor',
  title: i18n.global.t('dashboard.humanSensor'),
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'humansensor.png'
}