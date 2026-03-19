import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const HumidifyConfig: ConfigType = createI18nConfig({
  key: 'Humidify',
  chartKey: 'VHumidify',
  conKey: 'VCHumidify',
  title: () => i18n.global.t('dashboard.humidify_title'),
  category: ChatCategoryEnum.Air,
  categoryName: ChatCategoryEnumName.Air,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'humidify.png'
})