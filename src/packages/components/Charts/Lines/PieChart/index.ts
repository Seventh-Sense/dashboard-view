import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const PieChartConfig: ConfigType = {
  key: 'PieChart',
  chartKey: 'VPieChart',
  conKey: 'VCPieChart',
  title: i18n.global.t('dashboard.pie'),
  category: ChatCategoryEnum.LINE,
  categoryName: ChatCategoryEnumName.LINE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image: 'line.png'
}