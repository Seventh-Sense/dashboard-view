<template>
  <!-- 遍历 seriesList -->
  <CollapseItem :name="`仪表盘`" :expanded="true">
    <SettingItemBox name="数据">
      <SettingItem name="数值">
        <n-input-number
          v-model:value="config.dataset"
          :min="dialConfig.min"
          :max="dialConfig.max"
          :step="1"
          size="small"
          placeholder="数值"
        ></n-input-number>
      </SettingItem>
      <SettingItem name="字体大小">
        <n-input-number
          v-model:value="dialConfig.detail.fontSize"
          :min="0"
          :step="1"
          size="small"
          placeholder="字体大小"
        ></n-input-number>
      </SettingItem>
      <SettingItem name="颜色">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="dialConfig.detail.color"
        ></n-color-picker>
      </SettingItem>
    </SettingItemBox>
    <!-- Echarts 全局设置 -->
    <!-- 表盘 -->
    <SettingItemBox name="表盘外部">
      <SettingItem name="宽度">
        <n-input-number
          v-model:value="dialConfig.axisLine.lineStyle.width"
          :min="30"
          :step="1"
          size="small"
          placeholder="表盘宽度"
        ></n-input-number>
      </SettingItem>
      <SettingItem name="表盘颜色">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="config.series[0].axisLine.lineStyle.color[1][1]"
        ></n-color-picker>
      </SettingItem>
      <SettingItem name="进度条颜色">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="config.series[0].progress.itemStyle.color.colorStops[0].color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem name="">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="config.series[0].progress.itemStyle.color.colorStops[1].color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem name="圆角">
        <n-select v-model:value="radius" size="small" :options="capOptions"></n-select>
      </SettingItem>
    </SettingItemBox>
    <!-- 指针 -->
    <SettingItemBox name="刻度">
      <SettingItem name="最小值">
        <n-input-number
          v-model:value="dialConfig.min"
          :step="1"
          size="small"
          placeholder="数值"
        ></n-input-number>
      </SettingItem>
      <SettingItem name="最大值">
        <n-input-number
          v-model:value="dialConfig.max"
          :step="1"
          size="small"
          placeholder="数值"
        ></n-input-number>
      </SettingItem>
      <SettingItem name="颜色">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="dialConfig.axisLabel.rich.a.color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem name="字体大小">
        <n-input-number
          v-model:value="dialConfig.axisLabel.rich.a.fontSize"
          :min="0"
          :step="1"
          size="small"
          placeholder="字体大小"
        ></n-input-number>
      </SettingItem>
    </SettingItemBox>
  </CollapseItem>
</template>

<script setup lang="ts">
import { PropType, computed, watch, ref } from 'vue'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { GlobalThemeJsonType } from '@/settings/chartThemes'

const capOptions = [
  {
    label: '有圆角',
    value: 'true'
  },
  {
    label: '无圆角',
    value: 'false'
  }
]

const props = defineProps({
  optionData: {
    type: Object as PropType<GlobalThemeJsonType>,
    required: true
  }
})

const config = computed(() => {
  return props.optionData
})

const dialConfig = computed(() => {
  return props.optionData.series[0]
})

const radius = ref('false')

watch(
  () => radius.value,
  newData => {
    try {
      props.optionData.series[0].axisLine.roundCap = newData === 'true' ? true : false
    } catch (error) {
      console.log(error)
    }
  },
  {
    immediate: true,
    deep: false
  }
)

watch(
  () => props.optionData.series[0].detail.fontSize,
  newData => {
    try {
      props.optionData.series[0].detail.lineHeight = newData
    } catch (error) {
      console.log(error)
    }
  },
  {
    immediate: true,
    deep: false
  }
)

watch(
  () => props.optionData.series[0].axisLine.lineStyle.width,
  newData => {
    try {
      props.optionData.series[0].progress.width = newData
    } catch (error) {
      console.log(error)
    }
  },
  {
    immediate: true,
    deep: false
  }
)

watch(
  () => props.optionData.series[0].axisLine.roundCap,
  newData => {
    try {
      props.optionData.series[0].progress.roundCap = newData
    } catch (error) {
      console.log(error)
    }
  },
  {
    immediate: true,
    deep: false
  }
)
</script>
