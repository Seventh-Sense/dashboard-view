<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem :name="t('dashboard.value')">
        <n-input v-model:value="optionData.dataset" size="small"></n-input>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.set_value')">
      <SettingItem :name="t('dashboard.auto_title')">
        <n-input v-model:value="optionData.modes[0].value" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.sun_title')">
        <n-input v-model:value="optionData.modes[1].value" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.snow_title')">
        <n-input v-model:value="optionData.modes[2].value" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.fan2_title')">
        <n-input v-model:value="optionData.modes[3].value" size="small"></n-input>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.style')" :alone="false">
      <SettingItem :name="t('dashboard.text_size')">
        <n-input-number v-model:value="optionData.title_size" :min="1" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.text_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.title_color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.icon_size')">
        <n-input-number v-model:value="optionData.icon_size" :min="1" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.background')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.icon_bottom_color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.border_color')">
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
