<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem>
        <n-input-number
          v-model:value="optionData.dataset"
          :min="0"
          size="small"
        ></n-input-number>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.on_value')">
      <SettingItem>
        <n-input-number
          v-model:value="optionData.on_value"
          :min="0"
          size="small"
        ></n-input-number>
      </SettingItem>
    </SettingItemBox>
    <!-- <SettingItemBox :name="t('dashboard.style')" :alone="false">
      <SettingItem :name="t('dashboard.on_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.on_color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.off_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.off_color"
        ></n-color-picker>
      </SettingItem>
    </SettingItemBox> -->
  </CollapseItem>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { option } from './config'

const t = window['$t']

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})
</script>

<style lang="scss" scoped></style>
