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
      <setting-item :name="t('dashboard.color')">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.fontColor"></n-color-picker>
      </setting-item>
      <setting-item :name="t('dashboard.font_size')">
        <n-input-number v-model:value="optionData.fontSize" size="small" placeholder="字体大小"></n-input-number>
      </setting-item>
      <setting-item :name="t('dashboard.font_thickness')">
        <n-select v-model:value="optionData.fontWeight" size="small" :options="fontWeightOptions" />
      </setting-item>

      <setting-item :name="t('dashboard.word_spacing')">
        <n-input-number v-model:value="optionData.letterSpacing" size="small" placeholder="输入字间距"></n-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box :name="t('dashboard.shadow')">
      <setting-item>
        <n-space>
          <n-switch v-model:value="optionData.showShadow" size="small" />
          <n-text>{{ t('dashboard.show_shadows')}}</n-text>
        </n-space>
      </setting-item>
      <setting-item :name="t('dashboard.color')">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.colorShadow"></n-color-picker
      ></setting-item>
      <setting-item name="x">
        <n-input-number v-model:value="optionData.hShadow" size="small"></n-input-number
      ></setting-item>
      <setting-item name="y">
        <n-input-number v-model:value="optionData.vShadow" size="small"></n-input-number
      ></setting-item>
      <setting-item :name="t('dashboard.fuzzy')">
        <n-input-number v-model:value="optionData.blurShadow" size="small"></n-input-number
      ></setting-item>
    </setting-item-box>

    <setting-item-box :name="t('dashboard.animation')">
      <setting-item :name="t('dashboard.animation_speed')">
        <n-input-number
          v-model:value="optionData.animationSpeed"
          size="small"
          :placeholder="t('dashboard.animation_speed')"
          :min="0"
        ></n-input-number>
      </setting-item>
      <setting-item :name="t('dashboard.animation_interval')">
        <n-input-number
          v-model:value="optionData.animationTime"
          size="small"
          :placeholder="t('dashboard.animation_interval')"
          :min="0"
        ></n-input-number>
      </setting-item>
    </setting-item-box>
  </collapse-item>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { option, FontWeightEnum, FontWeightObject } from './config'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const t = window['$t']

const fontWeightOptions = [
  {
    label: t('dashboard.normal'),
    value: FontWeightObject[FontWeightEnum.NORMAL]
  },
  {
    label: t('dashboard.bold'),
    value: FontWeightObject[FontWeightEnum.BOLD]
  }
]

</script>
