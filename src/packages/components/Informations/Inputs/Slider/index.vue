<template>
  <div>
    <n-slider v-model:value="option.dataset" :step="10" />
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs, shallowReactive, watch } from 'vue'
import { CreateComponentType } from '../../../../../packages/index.d'
import { useChartDataFetch } from '../../../../../hooks/useChartDataFetch.hook'
import { useChartEditStore } from '../../../../../store/modules/chartEditStore/chartEditStore'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { w, h } = toRefs(props.chartConfig.attr)
const { size, color } = toRefs(props.chartConfig.option)

const option = shallowReactive({
  dataset: true
})

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    option.dataset = newVal
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
</style>
