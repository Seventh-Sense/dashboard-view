import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const DigitFrameConfig: ConfigType = {
  key: 'DigitFrame',
  chartKey: 'VDigitFrame',
  conKey: 'VCDigitFrame',
  title: '数值',
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'value.png'
}