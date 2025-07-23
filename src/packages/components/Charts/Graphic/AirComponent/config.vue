<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem :name="t('dashboard.value')">
        <n-input-number v-model:value="optionData.dataset" size="small"></n-input-number>
      </SettingItem>
      <setting-item :name="t('dashboard.background')">
        <n-select v-model:value="optionData.bg_png" :options="images" size="small" />
      </setting-item>
      <SettingItem :name="t('dashboard.font_size')">
        <n-input-number v-model:value="optionData.data_size" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.data_color"
        ></n-color-picker>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.title')" :alone="false">
      <setting-item :name="t('dashboard.contant')">
        <n-input v-model:value="optionData.title" size="small" />
      </setting-item>
      <SettingItem :name="t('dashboard.font_size')">
        <n-input-number v-model:value="optionData.title_size" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.title_color"
        ></n-color-picker>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.unit')" :alone="false">
      <setting-item :name="t('dashboard.contant')">
        <n-input v-model:value="optionData.unit" size="small" />
      </setting-item>
      <SettingItem :name="t('dashboard.font_size')">
        <n-input-number v-model:value="optionData.unit_size" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.unit_color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.decimal_place')">
        <n-select v-model:value="optionData.decimal" :options="decimals" size="small" />
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.quality')" :alone="false">
      <SettingItem :name="t('dashboard.icon_size')">
        <n-input-number v-model:value="optionData.icon_size" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.font_size')">
        <n-input-number v-model:value="optionData.icon_text_size" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.conditions')">
        <n-input-number v-model:value="optionData.conditions" :min="0" size="small" />
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

const images = [
  { label: t('dashboard.image_1'), value: 1 },
  { label: t('dashboard.image_2'), value: 2 },
  { label: t('dashboard.image_3'), value: 3 }
]

const decimals = [
  {
    label: '0',
    value: 0
  },
  {
    label: '1',
    value: 1
  },
  {
    label: '2',
    value: 2
  },
  {
    label: '3',
    value: 3
  }
]
</script>

<style lang="scss" scoped></style>
