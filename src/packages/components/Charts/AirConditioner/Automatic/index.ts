import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const AutomaticConfig: ConfigType = {
  key: 'Automatic',
  chartKey: 'VAutomatic',
  conKey: 'VCAutomatic',
  title: i18n.global.t('dashboard.auto_title'),
  category: ChatCategoryEnum.Air,
  categoryName: ChatCategoryEnumName.Air,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'autocontrol.png'
}