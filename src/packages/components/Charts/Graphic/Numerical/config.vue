<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem :name="t('dashboard.value')">
        <n-input-number v-model:value="optionData.dataset" size="small"></n-input-number>
      </SettingItem>
      <SettingItem :name="t('dashboard.font_size')">
        <n-input-number v-model:value="optionData.dataSize" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.value_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.dataColor"
        ></n-color-picker>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.top_title')" :alone="false">
      <setting-item :name="t('dashboard.title')">
        <n-input v-model:value="optionData.title" size="small" />
      </setting-item>
      <SettingItem :name="t('dashboard.font_size')">
        <n-input-number v-model:value="optionData.fontSize" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.value_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.textColor"
        ></n-color-picker>
      </SettingItem>
      <setting-item :name="t('dashboard.icon')">
        <n-select v-model:value="optionData.iconNo" :options="titles" size="small" />
      </setting-item>
      <SettingItem :name="t('dashboard.icon_size')">
        <n-input-number v-model:value="optionData.rightIconSize" size="small" />
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.unit')" :alone="false">
      <SettingItem>
        <n-space>
          <n-switch v-model:value="optionData.isUnit" size="small"></n-switch>
          <n-text>
            {{ t('dashboard.open') }}
            <n-text :depth="3">{{ t('dashboard.is_show') }}</n-text>
          </n-text>
        </n-space>
      </SettingItem>
      <setting-item :name="t('dashboard.unit')">
        <n-select v-model:value="optionData.unitText" :options="units" size="small" />
      </setting-item>
      <SettingItem :name="t('dashboard.font_size')">
        <n-input-number v-model:value="optionData.bottomTextSize" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.bottomTextColor"
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

const units = [
  {
    label: 'None',
    value: ''
  },
  {
    label: '℃',
    value: '℃'
  },
  {
    label: '%',
    value: '%'
  },
  {
    label: '%Rh',
    value: '%Rh'
  },
  {
    label: 'mg/m3',
    value: 'mg/m3'
  },
  {
    label: 'μg/m3',
    value: 'μg/m3'
  },
  {
    label: 'ppm',
    value: 'ppm'
  },
  {
    label: 'Pa',
    value: 'Pa'
  }
]

const titles = [
  {
    label: t('dashboard.temperature'),
    value: 1
  },
  {
    label: t('dashboard.humidity'),
    value: 2
  }
]
</script>

<style lang="scss" scoped></style>
