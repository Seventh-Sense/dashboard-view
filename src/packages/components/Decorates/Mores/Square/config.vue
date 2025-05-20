<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.color')">
      <SettingItem>
        <n-color-picker
          v-model:value="optionData.backgroundColor"
          size="small"
          :modes="['hex']"
        ></n-color-picker>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.fuzzy')">
      <SettingItem>
        <n-input-number
          v-model:value="optionData.opacity"
          size="small"
          :step="0.1"
          :min="0.0"
          :max="1.0"
        ></n-input-number>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.radius')">
      <SettingItem>
        <n-input-number
          v-model:value="optionData.radius"
          size="small"
          :step="1"
          :min="0"
          :max="36"
        ></n-input-number>
      </SettingItem>
    </SettingItemBox>
  </CollapseItem>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { option } from './config'
import {
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '@/components/Pages/ChartItemSetting'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const t = window['$t']
</script>

<style lang="scss" scoped>
</style>
