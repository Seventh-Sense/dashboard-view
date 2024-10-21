import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const HumidifyConfig: ConfigType = {
  key: 'Humidify',
  chartKey: 'VHumidify',
  conKey: 'VCHumidify',
  title: i18n.global.t('dashboard.pump_left'),
  category: ChatCategoryEnum.Air,
  categoryName: ChatCategoryEnumName.Air,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image: 'humidify.png'
}