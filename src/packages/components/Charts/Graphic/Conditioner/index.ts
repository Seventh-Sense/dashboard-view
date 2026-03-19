import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const ConditionerConfig: ConfigType = createI18nConfig({
  key: 'Conditioner',
  chartKey: 'VConditioner',
  conKey: 'VCConditioner',
  title: () => i18n.global.t('dashboard.tempControl'),
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'door.png'
})