import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const ExitConfig: ConfigType = {
  key: 'Exit',
  chartKey: 'VExit',
  conKey: 'VCExit',
  title: i18n.global.t('dashboard.exit'),
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.DECORATES,
  chartFrame: ChartFrameEnum.STATIC,
  image: 'exit.png'
}
