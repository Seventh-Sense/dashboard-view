<template>
  <n-button v-if="langStore.getLang === 'EN'" secondary circle @click="handleSelect(LangEnum.ZH)">
    EN
  </n-button>
  <n-button v-else secondary circle @click="handleSelect(LangEnum.EN)">中</n-button>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useLangStore } from '@/store/modules/langStore/langStore'
import { LangEnum } from '@/enums/styleEnum'

const { locale } = useI18n()
const langStore = useLangStore()

const handleSelect = (key: LangEnum) => {
  locale.value = key
  langStore.changeLang(key)
}
</script>
