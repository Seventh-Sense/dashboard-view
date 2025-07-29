<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem :name="t('dashboard.value')">
        <n-input v-model:value="optionData.dataset" size="small"></n-input>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.style')" :alone="false">
      <setting-item>
        <n-select v-model:value="optionData.mode_num" :options="options" size="small" />
      </setting-item>
      <SettingItem :name="t('dashboard.radius')">
        <n-input-number v-model:value="optionData.radius" :min="0" size="small" />
      </SettingItem>
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

    <SettingItemBox v-if="optionData.mode_num === 6" v-for="(item, index) in optionData.modes_6" :name="t('dashboard.option') + (index + 1)">
      <SettingItem>
        <n-input v-model:value="item.title" type="text" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.value')">
        <n-input v-model:value="item.value" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.icon')">
        <n-input v-model:value="item.icon" type="text" size="small"></n-input>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox v-else-if="optionData.mode_num === 4" v-for="(item, index) in optionData.modes_4" :name="t('dashboard.option') + (index + 1)">
      <SettingItem>
        <n-input v-model:value="item.title" type="text" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.value')">
        <n-input v-model:value="item.value" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.icon')">
        <n-input v-model:value="item.icon" type="text" size="small"></n-input>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox v-else-if="optionData.mode_num === 2" v-for="(item, index) in optionData.modes_2" :name="t('dashboard.option') + (index + 1)">
      <SettingItem>
        <n-input v-model:value="item.title" type="text" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.value')">
        <n-input v-model:value="item.value" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.icon')">
        <n-input v-model:value="item.icon" type="text" size="small"></n-input>
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

const options = [
  {
    label: '1 X 2',
    value: 2
  },
  {
    label: '2 X 2',
    value: 4
  },
  {
    label: '2 X 3',
    value: 6
  },
]
</script>

<style lang="scss" scoped></style>
