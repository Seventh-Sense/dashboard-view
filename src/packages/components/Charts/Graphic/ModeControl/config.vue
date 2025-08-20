<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem :name="t('dashboard.value')">
        <n-input-number v-model:value="optionData.dataset" size="small"></n-input-number>
      </SettingItem>
      <SettingItem :name="t('dashboard.on_value')">
        <n-input-number v-model:value="optionData.active_value" size="small"></n-input-number>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.icon')">
      <setting-item :name="t('dashboard.contant')">
        <n-input v-model:value="optionData.icon" size="small" />
      </setting-item>
      <SettingItem :name="t('dashboard.icon_size')">
        <n-input-number v-model:value="optionData.icon_size" :min="0" size="small" />
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.title')">
      <setting-item :name="t('dashboard.contant')">
        <n-input v-model:value="optionData.title" size="small" />
      </setting-item>
      <SettingItem :name="t('dashboard.title_size')">
        <n-input-number v-model:value="optionData.title_size" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.title_color')">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.title_color"></n-color-picker>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.style')">
      <SettingItem :name="t('dashboard.off_bg_color')">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.inactive_bgColor"></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.on_bg_color')">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.active_bgColor"></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.radius')">
        <n-input-number v-model:value="optionData.radius" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.y_gap')">
        <n-input-number v-model:value="optionData.gap" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.filter')">
        <n-input-number v-model:value="optionData.filter" :min="0" size="small" />
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
