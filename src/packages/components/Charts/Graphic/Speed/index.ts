import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const SpeedConfig: ConfigType = {
  key: 'Speed',
  chartKey: 'VSpeed',
  conKey: 'VCSpeed',
  title: i18n.global.t('dashboard.speed'),
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'windspeed.png'
}