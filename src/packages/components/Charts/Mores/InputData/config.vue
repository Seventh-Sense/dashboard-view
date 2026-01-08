<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem :name="t('dashboard.value')">
        <n-input-number v-model:value="optionData.dataset" size="small" :min="0"></n-input-number>
      </SettingItem>
      <SettingItem :name="t('dashboard.decimal_place')">
        <n-select v-model:value="optionData.decimal" :options="decimals" size="small" />
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.mode')">
      <SettingItem>
        <n-space>
          <n-switch v-model:value="optionData.is_edit" size="small"></n-switch>
          <n-text>
            {{ t('dashboard.open') }}
            <n-text :depth="3">{{ t('dashboard.edit_mode') }}</n-text>
          </n-text>
        </n-space>
      </SettingItem>
      <SettingItem :name="t('dashboard.icon_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.icon_color"
        ></n-color-picker>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.style')">
      <SettingItem :name="t('dashboard.value_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.font_size')">
        <n-input-number v-model:value="optionData.size" size="small" :min="0"></n-input-number>
      </SettingItem>

      <SettingItem>
        <n-space>
          <n-switch v-model:value="optionData.is_border" size="small"></n-switch>
          <n-text>
            {{ t('dashboard.open') }}
            <n-text :depth="3">{{ t('dashboard.border') }}</n-text>
          </n-text>
        </n-space>
      </SettingItem>
      <SettingItem :name="t('dashboard.border_size')">
        <n-input-number
          v-model:value="optionData.border_width"
          size="small"
          :min="0"
        ></n-input-number>
      </SettingItem>
      <SettingItem :name="t('dashboard.border_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.border_color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem>
        <n-space>
          <n-switch v-model:value="optionData.is_dark" size="small"></n-switch>
          <n-text>
            {{ t('dashboard.open') }}
            <n-text :depth="3">{{ t('dashboard.light_theme') }}</n-text>
          </n-text>
        </n-space>
      </SettingItem>
    </SettingItemBox>
  </CollapseItem>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { option } from './config'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const t = window['$t']

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

<style lang="less" scoped></style>
