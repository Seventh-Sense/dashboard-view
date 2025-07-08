import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const LightControlConfig: ConfigType = {
  key: 'LightControl',
  chartKey: 'VLightControl',
  conKey: 'VCLightControl',
  title: i18n.global.t('dashboard.light_control'),
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'ledControl.png'
}