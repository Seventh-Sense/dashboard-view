<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.style')" :alone="false">
      <SettingItem :name="t('dashboard.background')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.backgroundColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.radius')">
        <n-input-number v-model:value="optionData.radius" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.filter')">
        <n-input-number v-model:value="optionData.filter" :min="0" size="small" />
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.title')" :alone="false">
      <SettingItem>
        <n-space>
          <n-switch v-model:value="optionData.isTitle" size="small"></n-switch>
          <n-text>
            {{ t('dashboard.open') }}
            <n-text :depth="3">{{ t('dashboard.is_show') }}</n-text>
          </n-text>
        </n-space>
      </SettingItem>
      <SettingItem>
        <n-input v-model:value="optionData.title_content" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.font_size')">
        <n-input-number v-model:value="optionData.title_size" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.title_color"
        ></n-color-picker>
      </SettingItem>
    </SettingItemBox>
  </CollapseItem>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { option } from './config'

const t = window['$t']

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})
</script>

<style lang="scss" scoped></style>
