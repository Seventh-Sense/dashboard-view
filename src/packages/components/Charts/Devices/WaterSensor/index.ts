import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const WaterSensorConfig: ConfigType = {
  key: 'WaterSensor',
  chartKey: 'VWaterSensor',
  conKey: 'VCWaterSensor',
  title: i18n.global.t('dashboard.waterSensor'),
  category: ChatCategoryEnum.Device,
  categoryName: i18n.global.t('dashboard.device'),
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'watersensor.png'
}