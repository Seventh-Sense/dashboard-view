import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'
import { createI18nConfig } from '@/packages'

export const ConferenceSceneConfig: ConfigType = createI18nConfig({
  key: 'ConferenceScene',
  chartKey: 'VConferenceScene',
  conKey: 'VCConferenceScene',
  title: () => i18n.global.t('dashboard.conference_scene'),
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'scene2.png'
})