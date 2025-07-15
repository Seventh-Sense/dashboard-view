import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const BrightnessConfig: ConfigType = {
  key: 'Brightness',
  chartKey: 'VBrightness',
  conKey: 'VCBrightness',
  title: i18n.global.t('dashboard.brightness'),
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'switch.png'
}