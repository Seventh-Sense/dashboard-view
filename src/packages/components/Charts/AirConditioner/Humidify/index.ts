import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const HumidifyConfig: ConfigType = {
  key: 'Humidify',
  chartKey: 'VHumidify',
  conKey: 'VCHumidify',
  title: i18n.global.t('dashboard.humidify_title'),
  category: ChatCategoryEnum.Air,
  categoryName: ChatCategoryEnumName.Air,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'humidify.png'
}