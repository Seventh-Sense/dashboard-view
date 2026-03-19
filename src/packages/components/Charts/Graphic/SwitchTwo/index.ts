import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const SwitchTwoConfig: ConfigType = createI18nConfig({
  key: 'SwitchTwo',
  chartKey: 'VSwitchTwo',
  conKey: 'VCSwitchTwo',
  title: () => i18n.global.t('dashboard.switch2'),
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'switch2.png'
})