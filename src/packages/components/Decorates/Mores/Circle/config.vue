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
    <SettingItemBox :name="t('dashboard.border_color')">
      <SettingItem>
        <n-color-picker
          v-model:value="optionData.borderColor"
          size="small"
          :modes="['hex']"
        ></n-color-picker>
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
