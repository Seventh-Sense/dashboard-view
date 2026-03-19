import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const RadiosConfig: ConfigType = createI18nConfig({
  key: 'Radios',
  chartKey: 'VRadios',
  conKey: 'VCRadios',
  title: () => i18n.global.t('dashboard.speed') + '2',
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'radios.png'
})
