import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const HumidifyConfig: ConfigType = {
  key: 'Humidify',
  chartKey: 'VHumidify',
  conKey: 'VCHumidify',
  title: 'Humidify',
  category: ChatCategoryEnum.Air,
  categoryName: ChatCategoryEnumName.Air,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image: 'humidify.png'
}