import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const CircleConfig: ConfigType = {
  key: 'Circle',
  chartKey: 'VCircle',
  conKey: 'VCCircle',
  title: i18n.global.t('dashboard.circle_block'),
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.DECORATES,
  chartFrame: ChartFrameEnum.STATIC,
  image: 'block_breviary.png'
}