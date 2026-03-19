import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const ModeConfig: ConfigType = createI18nConfig({
  key: 'Mode',
  chartKey: 'VMode',
  conKey: 'VCMode',
  title: () => i18n.global.t('dashboard.coolOrHeat'),
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'ACMode.png'
})