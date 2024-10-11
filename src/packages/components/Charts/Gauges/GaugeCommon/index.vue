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
            @click="leftClick"
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
            @click="rightClick"
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
import Decimal from 'decimal.js'
import throttle from 'lodash/throttle'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<config>,
    required: true
  }
})
const t = window['$t']
const flag = ref(false)

const process = ref(90)
const value = ref<any>(35)

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

const dataHandle = (newData: any) => {
  value.value = newData
  let range = maxValue.value - minValue.value
  process.value = (Math.abs(minValue.value - newData) * 100) / range
  //console.log(newData, process.value, range)
}

function tNumber(str: any) {
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

function addition(a: any, b: any) {
  return new Decimal(a).add(new Decimal(b))
}

function subtraction(a: any, b: any) {
  return new Decimal(a).sub(new Decimal(b))
}

function fixedByDecimal(num: any) {
  if (decimal.value === 0) {
    return Number(num).toFixed()
  } else {
    return Number(num).toFixed(decimal.value).padEnd(4, '0')
  }
}

const rightClick = throttle(() => {
  onClick('right', step.value)
}, 1500)

const leftClick = throttle(() => {
  onClick('left', step.value)
}, 1500)

const onClick = (mode: string, step: number) => {
  let params = props.chartConfig.request.bindParams

  let data = mode === 'right' ? addition(value.value, step) : subtraction(value.value, step)

  if (params.objectID !== '') {
    flag.value = true
    updatePoint(params.objectID, { value: data })
      .then((res: any) => {
        if (res.value) {
          dataHandle(res.value)
          window['$message'].success(t('msg.gauge_msg_1'))
        } else {
          window['$message'].error(t('msg.gauge_msg_2'))
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        flag.value = false
      })
  } else {
    window['$message'].warning(t('msg.gauge_msg_3'))
  }
}
// 配置时
watch(
  () => props.chartConfig.option.dataset,
  newData => {
    try {
      if (!flag.value) {
        let num = tNumber(newData)
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
</style>
