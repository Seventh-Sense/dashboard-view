import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const FullScreenConfig: ConfigType = {
  key: 'FullScreen',
  chartKey: 'VFullScreen',
  conKey: 'VCFullScreen',
  title: i18n.global.t('dashboard.full_screen'),
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.DECORATES,
  chartFrame: ChartFrameEnum.STATIC,
  image: 'fullScreen.png'
}
