<template>
  <setting-item-box :name="t('dashboard.name')" :alone="true">
    <n-input
      type="text"
      maxlength="12"
      minlength="1"
      :placeholder="t('dashboard.nameTip')"
      size="small"
      clearable
      show-count
      v-model:value="chartConfig.title"
      @focus="handleFocus"
      @blur="handleBlur"
    ></n-input>
  </setting-item-box>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { SettingItemBox } from '@/components/Pages/ChartItemSetting'
import { ConfigType } from '@/packages/index.d'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<ConfigType>,
    required: true
  },
})
const t = window['$t']
let valueCatch = ''

const handleFocus = () => {
  valueCatch = props.chartConfig.title
}

const handleBlur = () => {
  if(!props.chartConfig.title.length) {
    window['$message'].warning(t('msg.please_input_chart'))
    props.chartConfig.title = valueCatch 
  }
}
</script>
