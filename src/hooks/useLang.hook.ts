import { computed } from 'vue'
import { LangEnum } from '@/enums/styleEnum'
import { useLangStore } from '@/store/modules/langStore/langStore'
import { dateEnUS, dateJaJP, dateZhCN, dateZhTW, enUS, jaJP, zhCN, zhTW } from 'naive-ui'

const LANG_PACK = {
  [LangEnum.ZH]: { locale: zhCN, dateLocale: dateZhCN },
  [LangEnum.ZH_TW]: { locale: zhTW, dateLocale: dateZhTW },
  [LangEnum.EN]: { locale: enUS, dateLocale: dateEnUS },
  [LangEnum.JA]: { locale: jaJP, dateLocale: dateJaJP }
} as const

// 语言切换
export const useLang = () => {
  const lang = useLangStore()

  const locale = computed(() => {
    return LANG_PACK[lang.getLang]?.locale ?? enUS
  })

  const dateLocale = computed(() => {
    return LANG_PACK[lang.getLang]?.dateLocale ?? dateEnUS
  })

  return {
    locale,
    dateLocale
  }
}
