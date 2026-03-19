import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const MulLineChartConfig: ConfigType = createI18nConfig({
  key: 'MulLineChart',
  chartKey: 'VMulLineChart',
  conKey: 'VCMulLineChart',
  title: () => i18n.global.t('dashboard.mulline'),
  category: ChatCategoryEnum.LINE,
  categoryName: ChatCategoryEnumName.LINE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image: 'line.png'
})