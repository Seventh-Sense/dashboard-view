<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem :name="t('dashboard.value')">
        <n-input v-model:value="optionData.dataset" size="small"></n-input>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.style')" :alone="false">
      <SettingItem :name="t('dashboard.on_text')">
        <n-input v-model:value="optionData.on_text" type="text" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.on_value')">
        <n-input v-model:value="optionData.on_contant" type="text" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.off_text')">
        <n-input v-model:value="optionData.off_text" type="text" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.on_value')">
        <n-input v-model:value="optionData.off_contant" type="text" size="small"></n-input>
      </SettingItem>
      <setting-item :name="t('dashboard.on_font_size')">
        <n-input-number
          v-model:value="optionData.on_font_size"
          size="small"
          placeholder="字体大小"
        ></n-input-number>
      </setting-item>
      <setting-item :name="t('dashboard.off_font_size')">
        <n-input-number
          v-model:value="optionData.off_font_size"
          size="small"
          placeholder="字体大小"
        ></n-input-number>
      </setting-item>
      <SettingItem :name="t('dashboard.on_text_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.active_color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.on_bg_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.active_bg_color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.off_text_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.inactive_color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.off_bg_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.inactive_bg_color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.background')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.background"
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
