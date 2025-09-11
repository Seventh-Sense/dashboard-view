import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const Bar2ChartConfig: ConfigType = {
  key: 'Bar2Chart',
  chartKey: 'VBar2Chart',
  conKey: 'VCBar2Chart',
  title: i18n.global.t('dashboard.bar') + '2',
  category: ChatCategoryEnum.LINE,
  categoryName: ChatCategoryEnumName.LINE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image: 'line.png'
}