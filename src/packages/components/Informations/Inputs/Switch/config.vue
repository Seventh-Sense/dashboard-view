<template>
  <CollapseItem name="属性" :expanded="true">
    <SettingItemBox name="样式">
      <setting-item name="尺寸">
        <n-select v-model:value="optionData.size" :options="sizeOptions" size="small" />
      </setting-item>
      <setting-item name="形状">
        <n-select v-model:value="optionData.round" :options="roundOptions" size="small" />
      </setting-item>
    </SettingItemBox>
    <SettingItemBox name="禁用">
      <n-switch v-model:value="optionData.disabled"/>
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
import { option, sizeOptions, roundOptions } from './config'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})
</script>
