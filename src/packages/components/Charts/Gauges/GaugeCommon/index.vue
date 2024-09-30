<template>
  <div>
    <a-progress
      :type="type"
      :percent="process"
      :size="w"
      :stroke-linecap="linecap"
      :stroke-color="{
        '0%': color[0],
        '100%': color[1]
      }"
      :trail-color="railColor"
      :gapDegree="90"
      :strokeWidth="strokeWidth"
    >
      <template #format="percent">
        <div class="flex-center">
          <n-icon
            v-if="isWrite"
            :component="ChevronBackOutline"
            :size="dataSize"
            :depth="1"
            @click="onClick('left', step)"
            style="cursor: pointer"
          />
          <span
            class="flex-center"
            :style="{
              fontWeight: 'bold',
              color: dataColor,
              marginBottom: '3px',
              fontSize: dataSize + 'px'
            }"
          >
            {{ value }}
          </span>
          <n-icon
            v-if="isWrite"
            :component="ChevronForwardOutline"
            :size="dataSize"
            :depth="1"
            @click="onClick('right', step)"
            style="cursor: pointer"
          />
        </div>
        <div :style="{ color: unitColor, fontSize: unitSize + 'px' }">{{ unit }}</div>
      </template>
    </a-progress>

    <div v-if="isScale">
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
import { ChevronForwardOutline, ChevronBackOutline } from '@vicons/ionicons5'
import { updatePoint } from '@/api/http'

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
  maxTop,
  linecap,
  isWrite,
  step,
  isScale,
} = toRefs(props.chartConfig.option)

const option = shallowReactive({
  dataset: configOption.dataset
})

const dataHandle = (newData: any) => {
  value.value = newData
  let range = maxValue.value - minValue.value
  process.value = (Math.abs(minValue.value - newData) * 100) / range
  //console.log(newData, process.value, range)
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

const onClick = (mode: string, step: number) => {
  let params = props.chartConfig.request.bindParams

  let data = mode === 'right' ? value.value + step : value.value - step

  console.log('aaa', params)
  if (params.objectID !== '') {
    updatePoint(params.objectID, { value: data })
      .then(res => {
        console.log('updatePoint', res)
        setTimeout(() => {
          window['$message'].success('该组件编辑成功!')
        }, 1500)
      })
      .catch(err => {})
  } else {
    window['$message'].warning('该组件未绑定对象!')
  }
}
// 配置时
watch(
  () => props.chartConfig.option.dataset,
  newData => {
    try {
      let num = convertToNumberAndRound(newData)
      //console.log(newData, num)
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

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
