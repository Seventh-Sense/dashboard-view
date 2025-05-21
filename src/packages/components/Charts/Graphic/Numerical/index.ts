import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const NumericalConfig: ConfigType = {
  key: 'Numerical',
  chartKey: 'VNumerical',
  conKey: 'VCNumerical',
  title: i18n.global.t('dashboard.numerical_control'),
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'door.png'
}