<template>
  <div>
    <a-progress
      :type="type"
      :percent="process"
      :size="w"
      stroke-linecap="butt"
      :stroke-color="{
        '0%': color[0],
        '100%': color[1]
      }"
      :trail-color="railColor"
      :gapDegree="90"
      :strokeWidth="strokeWidth"
    >
      <template #format="percent">
        <div
          :style="{
            fontWeight: 'bold',
            color: dataColor,
            marginBottom: '6px',
            fontSize: dataSize + 'px'
          }"
        >
          {{ value }}
        </div>
        <div :style="{ color: unitColor, fontSize: unitSize + 'px' }">{{ unit }}</div>
      </template>
    </a-progress>

    <div>
      <span
        class="min"
        :style="{
          color: minColor,
          marginTop: minTop + 'px',
          marginLeft: minLeft + 'px',
          fontSize: minSize + 'px'
        }"
      >
        {{ minValue }}
      </span>
      <span
        class="max"
        :style="{
          color: maxColor,
          marginTop: maxTop + 'px',
          marginRight: maxLeft + 'px',
          fontSize: maxSize + 'px'
        }"
      >
        {{ maxValue }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs, watch, shallowReactive, ref } from 'vue'
import { useChartDataFetch } from '@/hooks'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import config, { option as configOption } from './config'
import { toNumber } from '@/utils'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<config>,
    required: true
  }
})

const process = ref(90)
const value = ref(35)

const { w, h } = toRefs(props.chartConfig.attr)
const {
  dataset,
  dataColor,
  dataSize,
  type,
  color,
  railColor,
  strokeWidth,
  unit,
  unitColor,
  unitSize,
  maxValue,
  minValue,
  minColor,
  maxColor,
  minSize,
  maxSize,
  minLeft,
  maxLeft,
  minTop,
  maxTop
} = toRefs(props.chartConfig.option)

const option = shallowReactive({
  dataset: configOption.dataset
})

const dataHandle = (newData: any) => {
  value.value = newData
  let range = maxValue.value - minValue.value
  process.value = (newData * 100) / range
}

function convertToNumberAndRound(str: any) {
  let value = 0.0

  if (!str) {
    return value
  }

  if (typeof str === 'string') {
    value = Number(parseFloat(str).toFixed(1))
  }

  if (typeof str === 'number') {
    value = Number(str.toFixed(1))
  }

  return value
}

// 配置时
watch(
  () => props.chartConfig.option.dataset,
  newData => {
    try {
      let num = convertToNumberAndRound(newData)
      console.log(newData, num)
      dataHandle(num)
    } catch (error) {
      console.log(error)
    }
  },
  {
    immediate: true,
    deep: false
  }
)

// 预览更新
useChartDataFetch(props.chartConfig, useChartEditStore, (newData: number) => {
  option.dataset = toNumber(newData, 2)
})
</script>

<style lang="scss" scoped>
.min {
  float: left;
}
.max {
  float: right;
}
</style>
