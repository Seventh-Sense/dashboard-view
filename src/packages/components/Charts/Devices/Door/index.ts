import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const DoorConfig: ConfigType = {
  key: 'Door',
  chartKey: 'VDoor',
  conKey: 'VCDoor',
  title: i18n.global.t('dashboard.door'),
  category: ChatCategoryEnum.Device,
  categoryName: ChatCategoryEnumName.Device,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'door.png'
}