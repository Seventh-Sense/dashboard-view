import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const TemperatureChartConfig: ConfigType = {
  key: 'TemperatureChart',
  chartKey: 'VTemperatureChart',
  conKey: 'VCTemperatureChart',
  title: '湿度仪表盘',
  category: ChatCategoryEnum.Gauge,
  categoryName: ChatCategoryEnumName.Gauge,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image: 'electricity_breviary.png'
}
