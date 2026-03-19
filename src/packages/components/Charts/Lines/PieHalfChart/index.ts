import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const PieHalfChartConfig: ConfigType = createI18nConfig({
  key: 'PieHalfChart',
  chartKey: 'VPieHalfChart',
  conKey: 'VCPieHalfChart',
  title: () => i18n.global.t('dashboard.pie') + '2',
  category: ChatCategoryEnum.LINE,
  categoryName: ChatCategoryEnumName.LINE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image: 'line.png'
})