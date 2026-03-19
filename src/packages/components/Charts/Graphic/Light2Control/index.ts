import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const Light2ControlConfig: ConfigType = createI18nConfig({
  key: 'Light2Control',
  chartKey: 'VLight2Control',
  conKey: 'VCLight2Control',
  title: () => i18n.global.t('dashboard.light_control')+ '2',
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'light2.png'
})