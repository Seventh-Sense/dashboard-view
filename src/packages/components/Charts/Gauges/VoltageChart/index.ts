import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const VoltageChartConfig: ConfigType = {
  key: 'VoltageChart',
  chartKey: 'VVoltageChart',
  conKey: 'VCVoltageChart',
  title: '温度仪表盘',
  category: ChatCategoryEnum.Gauge,
  categoryName: ChatCategoryEnumName.Gauge,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image: 'voltage_breviary.png'
}

