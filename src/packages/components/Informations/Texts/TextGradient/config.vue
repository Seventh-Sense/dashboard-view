<template>
  <collapse-item :name="t('dashboard.effect')" :expanded="true">
    <setting-item-box :name="t('dashboard.texts')" :alone="true">
      <setting-item>
        <n-input v-model:value="optionData.dataset" type="textarea" size="small"></n-input>
      </setting-item>
    </setting-item-box>
  </collapse-item>
  <collapse-item :name="t('dashboard.style')" :expanded="true">
    <setting-item-box :name="t('dashboard.texts')">
      <setting-item :name="t('dashboard.font_size')">
        <n-input-number v-model:value="optionData.size" size="small" placeholder="字体大小"></n-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box :name="t('dashboard.gradient_color_param')">
      <setting-item :name="t('dashboard.initial_value')">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.gradient.from"></n-color-picker>
      </setting-item>
      <setting-item :name="t('dashboard.end_value')">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.gradient.to"></n-color-picker>
      </setting-item>
      <setting-item :name="t('dashboard.offset_angle')">
        <n-input-number v-model:value="optionData.gradient.deg" size="small" placeholder="颜色旋转"></n-input-number>
      </setting-item>
    </setting-item-box>

  </collapse-item>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { option } from './config'
import {
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '@/components/Pages/ChartItemSetting'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})
const t = window['$t']
</script>
