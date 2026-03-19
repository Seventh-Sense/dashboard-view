import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const WaterSensorConfig: ConfigType = createI18nConfig({
  key: 'WaterSensor',
  chartKey: 'VWaterSensor',
  conKey: 'VCWaterSensor',
  title: () => i18n.global.t('dashboard.waterSensor'),
  category: ChatCategoryEnum.Device,
  categoryName: ChatCategoryEnumName.Device,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'watersensor.png'
})