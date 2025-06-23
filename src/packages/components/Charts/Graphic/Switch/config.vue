<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem>
        <n-input v-model:value="optionData.dataset" size="small"></n-input>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.off_color')">
      <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.off"></n-color-picker>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.on_color')">
      <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.on"></n-color-picker>
    </SettingItemBox>
  </CollapseItem>
</template>
<script setup lang="ts">
import { PropType } from 'vue'
import {
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '@/components/Pages/ChartItemSetting'
import { option } from './config'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const t = window['$t']
</script>
