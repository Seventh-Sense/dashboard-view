import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const TimeCommonConfig: ConfigType = {
  key: 'TimeCommon',
  chartKey: 'VTimeCommon',
  conKey: 'VCTimeCommon',
  title: i18n.global.t('dashboard.general_time'),
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.DECORATES,
  chartFrame: ChartFrameEnum.STATIC,
  image: 'time.png'
}
