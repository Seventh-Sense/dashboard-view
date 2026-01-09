import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const EnumerateConfig: ConfigType = {
  key: 'Enumerate',
  chartKey: 'VEnumerate',
  conKey: 'VCEnumerate',
  title: i18n.global.t('dashboard.enumerate'),
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'circle.png'
}