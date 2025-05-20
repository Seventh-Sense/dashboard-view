import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const TextGradientConfig: ConfigType = {
  key: 'TextGradient',
  chartKey: 'VTextGradient',
  conKey: 'VCTextGradient',
  title: i18n.global.t('dashboard.gradient_text'),
  category: ChatCategoryEnum.TEXT,
  categoryName: ChatCategoryEnumName.TEXT,
  package: PackagesCategoryEnum.INFORMATIONS,
  chartFrame: ChartFrameEnum.NAIVE_UI,
  image: 'text_gradient.png'
}
