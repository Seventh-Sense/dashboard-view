import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const BrightnessConfig: ConfigType = createI18nConfig({
  key: 'Brightness',
  chartKey: 'VBrightness',
  conKey: 'VCBrightness',
  title: () => i18n.global.t('dashboard.brightness'),
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'bar.png'
})