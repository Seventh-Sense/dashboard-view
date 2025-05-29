<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox name="123" :alone="true">
      <n-select v-model:value="optionData.type" :options="options" size="small" />
    </SettingItemBox>
    <!-- <SettingItemBox :name="t('dashboard.icon_size')">
      <n-input-number v-model:value="optionData.size" size="small" />
    </SettingItemBox> -->
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

const options = [
  {
    label: t('dashboard.default'),
    value: 1
  },
  {
    label: t('dashboard.icon'),
    value: 2
  }
]
</script>

<style lang="scss" scoped></style>
