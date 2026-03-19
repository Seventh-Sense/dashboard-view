import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const DigitFrameConfig: ConfigType = createI18nConfig({
  key: 'DigitFrame',
  chartKey: 'VDigitFrame',
  conKey: 'VCDigitFrame',
  title: () => i18n.global.t('dashboard.numerical'),
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'value.png'
})