import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const CustomIconConfig: ConfigType = createI18nConfig({
  key: 'CustomIcon',
  chartKey: 'VCustomIcon',
  conKey: 'VCCustomIcon',
  title: () => i18n.global.t('dashboard.custom_icon'),
  category: ChatCategoryEnum.Air,
  categoryName: ChatCategoryEnumName.Air,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'autocontrol.png'
})