<template>
  <CollapseItem name="数值" :expanded="true">
    <SettingItemBox name="内容">
      <SettingItem name="数值">
        <n-input-number v-model:value="optionData.dataset" size="small" :min="0"></n-input-number>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox name="样式">
      <SettingItem name="颜色">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem name="字体大小">
        <n-input-number v-model:value="optionData.size" size="small"></n-input-number>
      </SettingItem>
      <setting-item name="单位">
        <n-select v-model:value="optionData.unit" :options="units" size="small" />
      </setting-item>
      <SettingItem name="小数位">
        <n-select v-model:value="optionData.decimal" :options="decimals" size="small" />
      </SettingItem>
    </SettingItemBox>
  </CollapseItem>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import {
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '../../../../../components/Pages/ChartItemSetting'
import { option, units, decimals } from './config'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})
</script>

<style lang="scss" scoped></style>
