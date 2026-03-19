import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const HyperlinkConfig: ConfigType = createI18nConfig({
  key: 'Hyperlink',
  chartKey: 'VHyperlink',
  conKey: 'VCHyperlink',
  title: () => i18n.global.t('dashboard.hyperlink'),
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.DECORATES,
  chartFrame: ChartFrameEnum.STATIC,
  image: 'circle.png'
})