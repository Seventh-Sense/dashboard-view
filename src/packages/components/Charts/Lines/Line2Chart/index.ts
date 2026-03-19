import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const Line2ChartConfig: ConfigType = createI18nConfig({
  key: 'Line2Chart',
  chartKey: 'VLine2Chart',
  conKey: 'VCLine2Chart',
  title: () => i18n.global.t('dashboard.line') + '2',
  category: ChatCategoryEnum.LINE,
  categoryName: ChatCategoryEnumName.LINE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image: 'line.png'
})