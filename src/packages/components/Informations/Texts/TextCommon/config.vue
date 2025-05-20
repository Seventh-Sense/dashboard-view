<template>
  <collapse-item :name="t('dashboard.effect')" :expanded="true">
    <setting-item-box :name="t('dashboard.texts')" :alone="true">
      <setting-item>
        <n-input v-model:value="optionData.dataset" type="textarea" size="small"></n-input>
      </setting-item>
    </setting-item-box>
    <!-- <setting-item-box name="链接" :alone="true">
      <setting-item>
        <n-input-group>
          <n-select
            v-model:value="optionData.linkHead"
            size="small"
            :style="{ width: '80%' }"
            :options="linkHeadOptions"
          />
          <n-input v-model:value="optionData.link" size="small"></n-input>
          <n-button :disabled="!optionData.link" secondary size="small" @click="handleLinkClick">跳转</n-button>
        </n-input-group>
      </setting-item>
    </setting-item-box> -->
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
      <setting-item :name="t('dashboard.x_inner_margin')">
        <n-input-number v-model:value="optionData.paddingX" size="small" placeholder="输入内边距"></n-input-number>
      </setting-item>
      <setting-item :name="t('dashboard.y_inner_margin')">
        <n-input-number v-model:value="optionData.paddingY" size="small" placeholder="输入内边距"></n-input-number>
      </setting-item>

      <setting-item :name="t('dashboard.horizontal_alignment')">
        <n-select v-model:value="optionData.textAlign" size="small" :options="textAlignOptions" />
      </setting-item>
      <setting-item :name="t('dashboard.text_direction')">
        <n-select v-model:value="optionData.writingMode" size="small" :options="verticalOptions" />
      </setting-item>

      <setting-item :name="t('dashboard.word_spacing')">
        <n-input-number v-model:value="optionData.letterSpacing" size="small" placeholder="输入字间距"></n-input-number>
      </setting-item>
    </setting-item-box>

    <setting-item-box :name="t('dashboard.border')">
      <setting-item :name="t('dashboard.width')">
        <n-input-number
          v-model:value="optionData.borderWidth"
          size="small"
          :min="0"
          :placeholder="t('dashboard.width')"
        ></n-input-number>
      </setting-item>
      <setting-item :name="t('dashboard.color')">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.borderColor"></n-color-picker>
      </setting-item>
      <setting-item :name="t('dashboard.radius')">
        <n-input-number
          v-model:value="optionData.borderRadius"
          size="small"
          :min="0"
          :placeholder="t('dashboard.radius')"
        ></n-input-number>
      </setting-item>
    </setting-item-box>

    <setting-item-box :name="t('dashboard.background')" :alone="true">
      <setting-item :name="t('dashboard.background_color')">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.backgroundColor"></n-color-picker>
      </setting-item>
    </setting-item-box>
  </collapse-item>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { option, WritingModeEnum, WritingModeObject, FontWeightEnum, FontWeightObject } from './config'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const t = window['$t']

const textAlignOptions = [
  { label: t('dashboard.left_alignment'), value: 'start' },
  { label: t('dashboard.center'), value: 'center' },
  { label: t('dashboard.right_alignment'), value: 'end' }
]

const verticalOptions = [
  {
    label: t('dashboard.level'),
    value: WritingModeObject[WritingModeEnum.HORIZONTAL]
  },
  {
    label: t('dashboard.vertical'),
    value: WritingModeObject[WritingModeEnum.VERTICAL]
  }
]
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
const handleLinkClick = () => {
  window.open(props.optionData.linkHead + props.optionData.link)
}
const linkHeadOptions = [
  { label: 'http://', value: 'http://' },
  { label: 'https://', value: 'https://' }
]
</script>
