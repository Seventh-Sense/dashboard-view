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
            @click="handleClick('left')"
            class="clickable-icon"
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
            {{ fixedByDecimal(value) }}
          </span>
          <n-icon
            v-if="isWrite"
            :component="ChevronForwardOutline"
            :size="dataSize"
            :depth="1"
            class="clickable-icon"
            @click="handleClick('right')"
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
import { parseData, toNumber, isRealValue } from '@/utils'
import { ChevronForwardOutline, ChevronBackOutline } from '@vicons/ionicons5'
import debounce from 'lodash/debounce'
import { cloneDeep } from 'lodash'
import { throttleTime, updateNodeData } from '@/packages/public'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<config>,
    required: true
  }
})
const t = window['$t']
const flag = ref(false)

const process = ref(90)
const value = ref<number>(26)
const tmp = ref<number>(26)

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
  decimal
} = toRefs(props.chartConfig.option)

const option = shallowReactive({
  dataset: configOption.dataset
})

const submitValue = debounce(async () => {
  //console.log('提交值：', value.value)

  try {
    flag.value = true

    let result = await updateNodeData(props.chartConfig?.request?.bindParams, Number(value.value))
    if (!result) {
      option.dataset = tmp.value
    }
  } catch (error) {
    console.error('操作失败:', error)
  } finally {
    flag.value = false
  }
}, throttleTime)

const handleClick = (direction: string) => {
  let newValue

  tmp.value = cloneDeep(value.value)

  if (direction === 'left') {
    newValue = value.value - step.value
    if (newValue < minValue.value) {
      newValue = minValue.value
    }
  } else if (direction === 'right') {
    newValue = value.value + step.value
    if (newValue > maxValue.value) {
      newValue = maxValue.value
    }
  }

  dataHandle(Number(newValue))
  submitValue()
}

const dataHandle = (newData: any) => {
  value.value = newData
  let range = maxValue.value - minValue.value
  process.value = (Math.abs(minValue.value - newData) * 100) / range
}

function fixedByDecimal(num: any) {
  if (decimal.value === 0) {
    return Number(num).toFixed()
  } else {
    return Number(num).toFixed(decimal.value)
  }
}

// 配置时
watch(
  () => props.chartConfig.option.dataset,
  newData => {
    try {
      if (!flag.value && isRealValue(newData)) {
        let num = parseData(newData, 'number')
        //console.log(newData, num)
        dataHandle(num)
      }
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

// .clickable-icon:active {
//   background-color: v-bind('railColor');; /* 点击时的背景色 */
//   border-radius: 8px;
// }
</style>
