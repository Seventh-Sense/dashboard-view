import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const MotorDeviceConfig: ConfigType = {
  key: 'MotorDevice',
  chartKey: 'VMotorDevice',
  conKey: 'VCMotorDevice',
  title: i18n.global.t('dashboard.pump_left'),
  category: ChatCategoryEnum.Device,
  categoryName: i18n.global.t('dashboard.device'),
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image: 'pumpleft.png'
}