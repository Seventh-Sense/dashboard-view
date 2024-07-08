<template>
    <img v-if="option.dataset" width="96" height="96" :src="SVG_ICON.card_icons.doorOpen" />
    <img v-else width="96" height="96" :src="SVG_ICON.card_icons.doorClose" />
  </template>
  
  <script setup lang="ts">
  import { PropType, shallowReactive, watch } from 'vue'
  import { CreateComponentType } from '../../../../../packages/index.d'
  import { useChartDataFetch } from '../../../../../hooks/useChartDataFetch.hook'
  import { useChartEditStore } from '../../../../../store/modules/chartEditStore/chartEditStore'
  import SVG_ICON from '../../../../../svg/SVG_ICON'
  
  const props = defineProps({
    chartConfig: {
      type: Object as PropType<CreateComponentType>,
      required: true
    }
  })
  
  const option = shallowReactive({
    dataset: true
  })
  
  watch(
    () => props.chartConfig.option.dataset,
    newVal => {
      if (typeof newVal === 'boolean') {
        option.dataset = newVal
      } else if (typeof newVal === 'number') {
        if (newVal > 0) {
          option.dataset = true
        } else {
          option.dataset = false
        }
      }
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
  
  <style lang="scss" scoped></style>
  