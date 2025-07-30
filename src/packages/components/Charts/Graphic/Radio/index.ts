import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const RadioConfig: ConfigType = {
  key: 'Radio',
  chartKey: 'VRadio',
  conKey: 'VCRadio',
  title: i18n.global.t('dashboard.switch') + '3',
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'radio.png'
}