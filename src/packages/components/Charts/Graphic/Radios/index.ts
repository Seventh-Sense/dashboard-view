import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const RadiosConfig: ConfigType = {
  key: 'Radios',
  chartKey: 'VRadios',
  conKey: 'VCRadios',
  title: i18n.global.t('dashboard.radios'),
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'switch2.png'
}