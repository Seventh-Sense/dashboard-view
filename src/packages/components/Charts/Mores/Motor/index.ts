import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const MotorConfig: ConfigType = {
  key: 'Motor',
  chartKey: 'VMotor',
  conKey: 'VCMotor',
  title: i18n.global.t('dashboard.motor'),
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'machine_breviary.png'
}