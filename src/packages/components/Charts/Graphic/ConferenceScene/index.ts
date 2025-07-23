import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import i18n from '@/i18n/index'

export const ConferenceSceneConfig: ConfigType = {
  key: 'ConferenceScene',
  chartKey: 'VConferenceScene',
  conKey: 'VCConferenceScene',
  title: i18n.global.t('dashboard.conference_scene'),
  category: ChatCategoryEnum.Graphic,
  categoryName: ChatCategoryEnumName.Graphic,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'numerical.png'
}