import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const MulBarChartConfig: ConfigType = createI18nConfig({
  key: 'MulBarChart',
  chartKey: 'VMulBarChart',
  conKey: 'VCMulBarChart',
  title: () => i18n.global.t('dashboard.mulbar'),
  category: ChatCategoryEnum.LINE,
  categoryName: ChatCategoryEnumName.LINE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image: 'line.png'
})