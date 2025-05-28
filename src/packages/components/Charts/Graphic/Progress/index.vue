<template>
  <a-progress
    :stroke-color="{
      '0%': color[1],
      '100%': color[0]
    }"
    :percent="percentage"
    :size="[300, height]"
    :stroke-linecap="linecap"
    :showInfo="showInfo"
  />
</template>

<script setup lang="ts">
import { PropType, toRefs, watch, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { color, maxValue, minValue, showInfo, linecap, height } = toRefs(props.chartConfig.option)

const percentage = ref(50)

const dataHandle = (newData: any) => {
  let range = maxValue.value - minValue.value
  percentage.value = (Math.abs(minValue.value - newData) * 100) / range
}

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    let tmp = parseData(newVal, 'number')
    dataHandle(tmp)
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss" scoped></style>
