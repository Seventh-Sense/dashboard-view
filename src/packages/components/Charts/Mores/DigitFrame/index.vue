<template>
  <div
    class="digit-style"
    :style="{
      color: color,
      fontSize: size + 'px'
    }"
  >
    {{ fixedByDecimal(option.dataset) }} {{ unit }}
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

const { size, color, unit, decimal } = toRefs(props.chartConfig.option)

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
.digit-style {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
