import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const AirComponentConfig: ConfigType = {
  key: 'AirComponent',
  chartKey: 'VAirComponent',
  conKey: 'VCAirComponent',
  title: i18n.global.t('dashboard.air_component'),
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'numerical.png'
}