<template>
  <n-popselect
    v-model:value="value"
    :options="langList"
    trigger="click"
    :on-update:value="handleSelect"
  >
    <div style="display: flex; align-items: center">
      <span class="lang-style">{{ text }}</span>
      <n-icon size="18" :depth="1" style="cursor: pointer">
        <ChevronDownOutlineIcon />
      </n-icon>
    </div>
  </n-popselect>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useLangStore } from '@/store/modules/langStore/langStore'
import { LangEnum } from '@/enums/styleEnum'
import { onMounted, ref, computed } from 'vue'
import { icon } from '@/plugins'

const { ChevronDownOutlineIcon } = icon.ionicons5

const { locale } = useI18n()
const langStore = useLangStore()

const langList = [
  {
    label: '中文',
    value: LangEnum.ZH
  },
  {
    label: '繁體中文',
    value: LangEnum.ZH_TW
  },
  {
    label: 'English',
    value: LangEnum.EN
  },
  {
    label: '日本語',
    value: LangEnum.JA
  }
]

const value = ref('')
const text = computed(() => {
  return langList.find(item => item.value === value.value)?.label
})

onMounted(() => {
  const lang = langStore.getLang
  if (lang) {
    value.value = lang
  }
})

const handleSelect = (key: LangEnum, option: any) => {
  value.value = key
  locale.value = key

  let language = ''
  if (key === 'EN') {
    language = 'en-US'
  } else if (key === 'JA') {
    language = 'ja-JP'
  } else if (key === 'ZH') {
    language = 'zh-CN'
  } else if (key === 'ZH_TW') {
    language = 'zh-TW'
  }
  localStorage.setItem('language', language)

  langStore.changeLang(key)
}
</script>

<style lang="scss" scoped>
.lang-style {
  @include fetch-theme-custom('color', 'login-font-color');
  cursor: pointer;
  font-size: 14px;
  margin-right: 6px;
}
</style>
