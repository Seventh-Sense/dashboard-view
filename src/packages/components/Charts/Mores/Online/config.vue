<template>
  <CollapseItem name="在线状态" :expanded="true">
    <SettingItemBox name="内容">
      <SettingItem>
        <n-space>
          <n-switch v-model:value="optionData.dataset" size="small"></n-switch>
        </n-space>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox name="样式">
      <SettingItem name="在线颜色">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.onlineColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem name="离线颜色">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.offlineColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem name="大小">
        <n-input-number v-model:value="optionData.size" size="small"></n-input-number>
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
import { option } from './config'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})
</script>

<style lang="scss" scoped></style>
