<template>
  <n-config-provider
    :theme="darkTheme"
    :hljs="hljsTheme"
    :locale="locale"
    :date-locale="dateLocale"
    :theme-overrides="overridesTheme"
    style="height: 100%"
  >
    <a-config-provider :locale="lang.getLang === 'ZH' ? zhCN : enUS"
      :theme="{
        algorithm: theme.darkAlgorithm
      }"
    >
      <!-- <n-theme-editor> -->
      <go-app-provider>
        <I18n></I18n>
        <router-view :key="routeKey"></router-view>
      </go-app-provider>
      <!-- </n-theme-editor> -->
    </a-config-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { NConfigProvider } from 'naive-ui'
import { GoAppProvider } from '@/components/GoAppProvider'
import { I18n } from '@/components/I18n'
import { useDarkThemeHook, useThemeOverridesHook, useCode, useLang } from '@/hooks'
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { theme } from 'ant-design-vue'
import '@x-plateform/graphic-editor/dist/style.css'
import '@x-plateform/common/dist/style.css'
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { useLangStore } from '@/store/modules/langStore/langStore'
//import { he } from 'element-plus/es/locale'

const route = useRoute()
const lang = useLangStore()

const routeKey = computed(() => route.path)
// 暗黑主题
const darkTheme = useDarkThemeHook()

// 主题配置
const overridesTheme = useThemeOverridesHook()

// 代码主题
const hljsTheme = useCode()

// 全局语言
const { locale, dateLocale } = useLang()
//测试提交
</script>

<style lang="scss" scoped>
div[aria-hidden='true'] {
  display: none !important;
}
</style>
