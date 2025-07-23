<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem :name="t('dashboard.value')">
        <n-input v-model:value="optionData.dataset" size="small"></n-input>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.style')" :alone="false">
      <SettingItem :name="t('dashboard.x_gap')">
        <n-input-number v-model:value="optionData.x_gap" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.y_gap')">
        <n-input-number v-model:value="optionData.y_gap" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.padding')">
        <n-input-number v-model:value="optionData.padding" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.icon_size')">
        <n-input-number v-model:value="optionData.icon_size" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.text_w')">
        <n-input-number v-model:value="optionData.icon_w" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.text_h')">
        <n-input-number v-model:value="optionData.icon_h" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.on_bg_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.active_bgColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.off_bg_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.inactive_bgColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.radius')">
        <n-input-number v-model:value="optionData.radius" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.filter')">
        <n-input-number v-model:value="optionData.filter" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.title_size')">
        <n-input-number v-model:value="optionData.title_size" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.title_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.title_color"
        ></n-color-picker>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.option') + '1'">
      <SettingItem>
        <n-input v-model:value="optionData.modes[0].title" type="text" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.value')">
        <n-input v-model:value="optionData.modes[0].value" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.icon')">
        <n-input v-model:value="optionData.modes[0].icon" type="text" size="small"></n-input>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.option') + '2'">
      <SettingItem>
        <n-input v-model:value="optionData.modes[1].title" type="text" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.value')">
        <n-input v-model:value="optionData.modes[1].value" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.icon')">
        <n-input v-model:value="optionData.modes[1].icon" type="text" size="small"></n-input>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.option') + '3'">
      <SettingItem>
        <n-input v-model:value="optionData.modes[2].title" type="text" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.value')">
        <n-input v-model:value="optionData.modes[2].value" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.icon')">
        <n-input v-model:value="optionData.modes[2].icon" type="text" size="small"></n-input>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.option') + '4'">
      <SettingItem>
        <n-input v-model:value="optionData.modes[3].title" type="text" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.value')">
        <n-input v-model:value="optionData.modes[3].value" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.icon')">
        <n-input v-model:value="optionData.modes[3].icon" type="text" size="small"></n-input>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.option') + '5'">
      <SettingItem>
        <n-input v-model:value="optionData.modes[4].title" type="text" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.value')">
        <n-input v-model:value="optionData.modes[4].value" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.icon')">
        <n-input v-model:value="optionData.modes[4].icon" type="text" size="small"></n-input>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.option') + '6'">
      <SettingItem>
        <n-input v-model:value="optionData.modes[5].title" type="text" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.value')">
        <n-input v-model:value="optionData.modes[5].value" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.icon')">
        <n-input v-model:value="optionData.modes[5].icon" type="text" size="small"></n-input>
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
