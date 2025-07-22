<template>
  <div
    class="container"
    :style="{
      color: color,
      fontSize: size + 'px',
      height: h + 'px'
    }"
  >
    <div v-if="title_switch">{{ title_text }}</div>
    <div class="digit-style">{{ fixedByDecimal(option.dataset) }} {{ unit }}</div>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs, shallowReactive, watch } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { useChartDataFetch } from '@/hooks/useChartDataFetch.hook'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { parseData } from '@/utils'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { size, color, unit, decimal, title_switch, title_text } = toRefs(props.chartConfig.option)
const { w, h } = toRefs(props.chartConfig.attr)

const option = shallowReactive({
  dataset: 40
})

function fixedByDecimal(num: any) {
  if (decimal.value === 0) {
    return Number(num).toFixed()
  } else {
    return Number(num).toFixed(decimal.value)
  }
}

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    option.dataset = parseData(newVal, 'number')
  },
  {
    immediate: true,
    deep: true
  }
)

useChartDataFetch(props.chartConfig, useChartEditStore, (newVal: string | number) => {
  // @ts-ignore
  option.dataset = newVal
})
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-items: flex-start;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.digit-style {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
}
</style>
