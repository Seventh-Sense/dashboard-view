<template>
  <div class="online-style">
    <div
      class="circle"
      :style="{
        backgroundColor: option.dataset ? onlineColor : offlineColor,
        width: size + 'px',
        height: size + 'px'
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs, shallowReactive, watch } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'
import { useChartDataFetch } from '@/hooks/useChartDataFetch.hook'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { onlineColor, offlineColor, size } = toRefs(props.chartConfig.option)

const option = shallowReactive({
  dataset: false
})

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    option.dataset = parseData(newVal, 'boolean')
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
.circle {
  border-radius: 50%;
  animation: spin 2s linear infinite;
}
.online-style {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
