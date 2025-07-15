import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const Light2ControlConfig: ConfigType = {
  key: 'Light2Control',
  chartKey: 'VLight2Control',
  conKey: 'VCLight2Control',
  title: i18n.global.t('dashboard.light_control')+ '2',
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'ledControl.png'
}