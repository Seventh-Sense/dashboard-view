<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem :name="t('dashboard.value')">
        <n-input-number v-model:value="optionData.dataset" size="small" :min="0"></n-input-number>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.style')">
      <SettingItem :name="t('dashboard.color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.font_size')">
        <n-input-number v-model:value="optionData.size" size="small"></n-input-number>
      </SettingItem>
      <setting-item :name="t('dashboard.unit')">
        <n-select v-model:value="optionData.unit" :options="units" size="small" />
      </setting-item>
      <SettingItem :name="t('dashboard.decimal_place')">
        <n-select v-model:value="optionData.decimal" :options="decimals" size="small" />
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.title')" :alone="false">
      <SettingItem>
        <n-space>
          <n-switch v-model:value="optionData.title_switch" size="small"></n-switch>
          <n-text>
            {{ t('dashboard.open') }}
            <n-text :depth="3">{{ t('dashboard.is_title') }}</n-text>
          </n-text>
        </n-space>
      </SettingItem>
      <SettingItem v-if="optionData.title_switch" :name="t('dashboard.text')">
        <n-input v-model:value="optionData.title_text" type="text" size="small"></n-input>
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
import { option, units, decimals } from './config'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const t = window['$t']
</script>

<style lang="scss" scoped></style>
