import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const SquareConfig: ConfigType = {
  key: 'Square',
  chartKey: 'VSquare',
  conKey: 'VCSquare',
  title: i18n.global.t('dashboard.square_block'),
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.DECORATES,
  chartFrame: ChartFrameEnum.STATIC,
  image: 'block_breviary.png'
}