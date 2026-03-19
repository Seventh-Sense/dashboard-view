import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const GaugeCommonConfig: ConfigType = createI18nConfig({
  key: 'GaugeCommon',
  chartKey: 'VGaugeCommon',
  conKey: 'VCGaugeCommon',
  title: () => i18n.global.t('dashboard.gradient_dial'),
  category: ChatCategoryEnum.Gauge,
  categoryName: ChatCategoryEnumName.Gauge,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image: 'dial.png'
})
