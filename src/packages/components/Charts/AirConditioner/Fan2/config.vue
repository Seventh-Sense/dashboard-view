<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem>
        <n-input-number v-model:value="optionData.dataset" :min="0" size="small"></n-input-number>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.on_value')">
      <SettingItem>
        <n-input-number v-model:value="optionData.on_value" :min="0" size="small"></n-input-number>
      </SettingItem>
      <SettingItem>
        <n-space>
          <n-switch v-model:value="optionData.iswrite" size="small"></n-switch>
          <n-text>
            {{ t('dashboard.open') }}
            <n-text :depth="3">{{ t('dashboard.writeable') }}</n-text>
          </n-text>
        </n-space>
      </SettingItem>
    </SettingItemBox>
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
