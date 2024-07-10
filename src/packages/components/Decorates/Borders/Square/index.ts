import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'

export const SquareConfig: ConfigType = {
  key: 'Square',
  chartKey: 'VSquare',
  conKey: 'VCSquare',
  title: '方形块',
  category: ChatCategoryEnum.BORDER,
  categoryName: ChatCategoryEnumName.BORDER,
  package: PackagesCategoryEnum.DECORATES,
  chartFrame: ChartFrameEnum.STATIC,
  image: 'block_breviary.png'
}