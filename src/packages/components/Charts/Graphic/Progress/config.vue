<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem :name="t('dashboard.value')">
        <n-input-number v-model:value="optionData.dataset" size="small"></n-input-number>
      </SettingItem>
      <SettingItem :name="t('dashboard.height')">
        <n-input-number v-model:value="optionData.height" size="small"></n-input-number>
      </SettingItem>
      
      <SettingItem :name="t('dashboard.progress_color_0')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.color[1]"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.progress_color_100')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.color[0]"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.min')">
        <n-input-number v-model:value="optionData.minValue" size="small"></n-input-number>
      </SettingItem>
      <SettingItem :name="t('dashboard.max')">
        <n-input-number v-model:value="optionData.maxValue" size="small"></n-input-number>
      </SettingItem>
      <SettingItem :name="t('dashboard.orbital_edge')">
        <n-select v-model:value="optionData.linecap" :options="caps" size="small" />
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.display_value')">
      <n-space>
        <n-switch v-model:value="optionData.showInfo" size="small"></n-switch>
      </n-space>
    </SettingItemBox>
  </CollapseItem>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { option, caps } from './config'

const t = window['$t']

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})
</script>

<style lang="scss" scoped></style>
