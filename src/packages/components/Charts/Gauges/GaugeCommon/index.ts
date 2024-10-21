import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const GaugeCommonConfig: ConfigType = {
  key: 'GaugeCommon',
  chartKey: 'VGaugeCommon',
  conKey: 'VCGaugeCommon',
  title: i18n.global.t('dashboard.gradient_dial'),
  category: ChatCategoryEnum.Gauge,
  categoryName: ChatCategoryEnumName.Gauge,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image: 'dial.png'
}
