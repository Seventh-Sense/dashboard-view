<template>
  <CollapseItem name="样式" :expanded="true">
    <SettingItemBox name="滑动">
      <SettingItem name="数据">
        <n-input-number v-model:value="optionData.dataset" size="small"></n-input-number>
      </SettingItem>
      <SettingItem name="最小值">
        <n-input-number v-model:value="optionData.min" size="small"></n-input-number>
      </SettingItem>
      <SettingItem name="最大值">
        <n-input-number v-model:value="optionData.max" size="small"></n-input-number>
      </SettingItem>
      <SettingItem name="字体大小">
        <n-input-number v-model:value="optionData.fontSize" size="small"></n-input-number>
      </SettingItem>
      <SettingItem name="字体颜色">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.color"
        ></n-color-picker>
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
</script>

<style lang="scss" scoped></style>
