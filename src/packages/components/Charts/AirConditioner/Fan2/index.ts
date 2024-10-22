import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const Fan2Config: ConfigType = {
  key: 'Fan2',
  chartKey: 'VFan2',
  conKey: 'VCFan2',
  title: i18n.global.t('dashboard.fan2_title'),
  category: ChatCategoryEnum.Air,
  categoryName: ChatCategoryEnumName.Air,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'fan2.png'
}