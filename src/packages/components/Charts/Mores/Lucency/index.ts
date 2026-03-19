import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const LucencyConfig: ConfigType = createI18nConfig({
  key: 'Lucency',
  chartKey: 'VLucency',
  conKey: 'VCLucency',
  title: () => i18n.global.t('dashboard.lucency'),
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'circle.png'
})