<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem :name="t('dashboard.value')">
        <n-input v-model:value="optionData.dataset" size="small"></n-input>
      </SettingItem>
      <SettingItem>
        <n-space>
          <n-switch v-model:value="optionData.is_display_bg" size="small"></n-switch>
          <n-text>
            {{ t('dashboard.open') }}
            <n-text :depth="3">{{ t('dashboard.writeable') }}</n-text>
          </n-text>
        </n-space>
      </SettingItem>
      <SettingItem v-show="optionData.is_display_bg" :name="t('dashboard.on_value')">
        <n-input v-model:value="optionData.avtive_value" size="small"></n-input>
      </SettingItem>
      <SettingItem v-show="optionData.is_display_bg" :name="t('dashboard.on_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.avtive_background"
        ></n-color-picker>
      </SettingItem>
      <SettingItem v-show="optionData.is_display_bg" :name="t('dashboard.off_value')">
        <n-input v-model:value="optionData.inavtive_value" size="small"></n-input>
      </SettingItem>
      <SettingItem v-show="optionData.is_display_bg" :name="t('dashboard.off_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.inavtive_background"
        ></n-color-picker>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.style')" :alone="false">
      <SettingItem :name="t('dashboard.icon')">
        <n-input v-model:value="optionData.icon" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.icon_size')">
        <n-input-number v-model:value="optionData.icon_size" :min="1" size="small" />
      </SettingItem>
      <SettingItem v-show="optionData.is_display_bg" :name="t('dashboard.border_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.border_color"
        ></n-color-picker>
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
