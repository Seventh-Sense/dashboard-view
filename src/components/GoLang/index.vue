<template>
  <n-popselect
    v-model:value="value"
    :options="langList"
    trigger="click"
    :on-update:value="handleSelect"
  >
    <div style="display: flex; align-items: center">
      <span class="lang-style">{{ text }}</span>
      <n-icon size="18" color="white">
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
    label: 'English',
    value: LangEnum.EN
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
  langStore.changeLang(key)

  setTimeout(() => {
    window.location.reload()
  }, 500)
}
</script>

<style lang="scss" scoped>
.lang-style {
  color: white;
  cursor: pointer;
  font-size: 14px;
  margin-right: 6px;
}
</style>
