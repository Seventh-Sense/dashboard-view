<template>
  <n-config-provider
    :theme="darkTheme"
    :hljs="hljsTheme"
    :locale="locale"
    :date-locale="dateLocale"
    :theme-overrides="overridesTheme"
  >
    <!-- <n-theme-editor> -->
      <go-app-provider>
        <I18n></I18n>
        <router-view></router-view>
      </go-app-provider>
    <!-- </n-theme-editor> -->
  </n-config-provider>
</template>

<script lang="ts" setup>
import { NConfigProvider } from 'naive-ui'
import { GoAppProvider } from '@/components/GoAppProvider'
import { I18n } from '@/components/I18n'
import { useDarkThemeHook, useThemeOverridesHook, useCode, useLang } from '@/hooks'
import { NThemeEditor } from 'naive-ui'
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
