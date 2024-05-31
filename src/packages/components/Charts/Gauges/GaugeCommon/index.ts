import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const GaugeCommonConfig: ConfigType = {
  key: 'GaugeCommon',
  chartKey: 'VGaugeCommon',
  conKey: 'VCGaugeCommon',
  title: '表盘',
  category: ChatCategoryEnum.Gauge,
  categoryName: ChatCategoryEnumName.Gauge,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image: 'dial.png'
}
