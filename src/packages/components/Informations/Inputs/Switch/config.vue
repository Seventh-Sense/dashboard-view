<template>
  <CollapseItem name="属性" :expanded="true">
    <SettingItemBox name="Off 颜色">
      <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.off"></n-color-picker>
    </SettingItemBox>
    <SettingItemBox name="On 颜色">
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
</script>
