<template>
  <CollapseItem name="背景" :expanded="true">
    <SettingItemBox name="颜色">
      <SettingItem>
        <n-color-picker
          v-model:value="optionData.backgroundColor"
          size="small"
          :modes="['hex']"
        ></n-color-picker>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox name="模糊">
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
    <SettingItemBox name="圆角">
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
</script>

<style lang="scss" scoped>
</style>
