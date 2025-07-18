import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const ModeGroupConfig: ConfigType = {
  key: 'ModeGroup',
  chartKey: 'VModeGroup',
  conKey: 'VCModeGroup',
  title: i18n.global.t('dashboard.mode_group'),
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'mode.png'
}