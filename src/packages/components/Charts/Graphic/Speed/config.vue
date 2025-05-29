<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <!-- <SettingItemBox name="123" :alone="true">
      <n-input v-model:value="optionData.dataset" size="small" />
    </SettingItemBox> -->

    <SettingItemBox :name="t('dashboard.speed_auto')" :alone="true">
      <n-input v-model:value="optionData.speeds[0]" size="small" />
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.speed_high')" :alone="true">
      <n-input v-model:value="optionData.speeds[1]" size="small" />
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.speed_middle')" :alone="true">
      <n-input v-model:value="optionData.speeds[2]" size="small" />
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.speed_low')" :alone="true">
      <n-input v-model:value="optionData.speeds[3]" size="small" />
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

const t = window['$t']
</script>

<style lang="scss" scoped></style>
