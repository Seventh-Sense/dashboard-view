import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const HumidityChartConfig: ConfigType = {
  key: 'HumidityChart',
  chartKey: 'VHumidityChart',
  conKey: 'VCHumidityChart',
  title: i18n.global.t('dashboard.humidify_title'),
  category: ChatCategoryEnum.LINE,
  categoryName: ChatCategoryEnumName.LINE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image: 'numerical.png'
}