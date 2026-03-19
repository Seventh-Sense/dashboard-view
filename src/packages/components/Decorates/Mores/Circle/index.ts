import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const CircleConfig: ConfigType = createI18nConfig({
  key: 'Circle',
  chartKey: 'VCircle',
  conKey: 'VCCircle',
  title: () => i18n.global.t('dashboard.circle_block'),
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.DECORATES,
  chartFrame: ChartFrameEnum.STATIC,
  image: 'circle.png'
})