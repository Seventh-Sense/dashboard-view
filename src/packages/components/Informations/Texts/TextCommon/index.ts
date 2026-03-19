import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const TextCommonConfig: ConfigType = createI18nConfig({
  key: 'TextCommon',
  chartKey: 'VTextCommon',
  conKey: 'VCTextCommon',
  title: () => i18n.global.t('dashboard.texts'),
  category: ChatCategoryEnum.TEXT,
  categoryName: ChatCategoryEnumName.TEXT,
  package: PackagesCategoryEnum.INFORMATIONS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'text_static.png'
})
