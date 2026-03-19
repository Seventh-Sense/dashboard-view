import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const LedConfig: ConfigType = createI18nConfig({
  key: 'Led',
  chartKey: 'VLed',
  conKey: 'VCLed',
  title: () => i18n.global.t('dashboard.led'),
  category: ChatCategoryEnum.Device,
  categoryName: ChatCategoryEnumName.Device,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'led_breviary.png'
})