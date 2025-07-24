import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const SquareTitleConfig: ConfigType = {
  key: 'SquareTitle',
  chartKey: 'VSquareTitle',
  conKey: 'VCSquareTitle',
  title: i18n.global.t('dashboard.square_block') + '2',
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.DECORATES,
  chartFrame: ChartFrameEnum.STATIC,
  image: 'block_breviary.png'
}