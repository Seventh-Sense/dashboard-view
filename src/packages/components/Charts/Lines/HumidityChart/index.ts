import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const HumidityChartConfig: ConfigType = createI18nConfig({
  key: 'HumidityChart',
  chartKey: 'VHumidityChart',
  conKey: 'VCHumidityChart',
  title: () => i18n.global.t('dashboard.humidify_title'),
  category: ChatCategoryEnum.LINE,
  categoryName: ChatCategoryEnumName.LINE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image: 'numerical.png'
})