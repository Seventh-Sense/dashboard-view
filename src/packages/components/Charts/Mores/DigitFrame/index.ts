import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const DigitFrameConfig: ConfigType = {
  key: 'DigitFrame',
  chartKey: 'VDigitFrame',
  conKey: 'VCDigitFrame',
  title: i18n.global.t('dashboard.numerical'),
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'value.png'
}