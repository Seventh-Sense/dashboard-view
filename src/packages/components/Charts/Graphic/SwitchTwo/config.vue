<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem>
        <n-input-number
          v-model:value="optionData.dataset"
          :min="0"
          :max="1"
          size="small"
        ></n-input-number>
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
} from '@/components/Pages/ChartItemSetting'
import { option } from './config'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const t = window['$t']
</script>
