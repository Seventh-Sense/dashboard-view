<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem>
        <n-space>
          <n-switch v-model:value="optionData.dataset" size="small"></n-switch>
        </n-space>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.style')">
      <SettingItem :name="t('dashboard.online_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.onlineColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.offline_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.offlineColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.size')">
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

const t = window['$t']
</script>

<style lang="scss" scoped></style>
