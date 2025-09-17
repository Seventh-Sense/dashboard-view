<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <!-- <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem :name="t('dashboard.value')">
        <n-input-number v-model:value="optionData.dataset" :min="0" size="small"></n-input-number>
      </SettingItem>
    </SettingItemBox> -->
    <SettingItemBox :name="t('dashboard.style')" :alone="false">
      <SettingItem :name="t('dashboard.background')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.background_color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.thumb')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.thumb_color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.orbit')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.track_color"
        ></n-color-picker>
      </SettingItem>
    </SettingItemBox>
  </CollapseItem>
</template>

<script setup lang="ts">
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { PropType } from 'vue'
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
