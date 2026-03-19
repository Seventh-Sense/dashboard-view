import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const ModeControlConfig: ConfigType = createI18nConfig({
  key: 'ModeControl',
  chartKey: 'VModeControl',
  conKey: 'VCModeControl',
  title: () => i18n.global.t('dashboard.mode_control'),
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'scene1.png'
})