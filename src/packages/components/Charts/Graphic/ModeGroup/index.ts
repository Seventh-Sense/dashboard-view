import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const ModeGroupConfig: ConfigType = createI18nConfig({
  key: 'ModeGroup',
  chartKey: 'VModeGroup',
  conKey: 'VCModeGroup',
  title: () => i18n.global.t('dashboard.mode_group'),
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'ACMode2.png'
})