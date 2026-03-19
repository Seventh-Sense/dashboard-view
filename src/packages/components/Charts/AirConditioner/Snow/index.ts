import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const SnowConfig: ConfigType = createI18nConfig({
  key: 'Snow',
  chartKey: 'VSnow',
  conKey: 'VCSnow',
  title: () => i18n.global.t('dashboard.snow_title'),
  category: ChatCategoryEnum.Air,
  categoryName: ChatCategoryEnumName.Air,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'snow.png'
})