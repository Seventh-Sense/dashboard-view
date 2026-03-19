import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const AirComponentConfig: ConfigType = createI18nConfig({
  key: 'AirComponent',
  chartKey: 'VAirComponent',
  conKey: 'VCAirComponent',
  title: () => i18n.global.t('dashboard.air_component'),
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'environment.png'
})