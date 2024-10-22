<template>
  <img v-if="option.dataset" width="96" height="96" :src="SVG_ICON.card_icons.motorOn" />
  <img v-else width="96" height="96" :src="SVG_ICON.card_icons.motorOff" />
</template>

<script setup lang="ts">
import { PropType, ref, watch, toRefs, shallowReactive } from 'vue'
import { CreateComponentType } from '../../../../../packages/index.d'
import { useChartDataFetch } from '../../../../../hooks/useChartDataFetch.hook'
import { useChartEditStore } from '../../../../../store/modules/chartEditStore/chartEditStore'
import { option as configOption } from './config'
import SVG_ICON from '@/svg/SVG_ICON'
import { parseData } from '@/utils'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const option = shallowReactive({
  dataset: false
})

watch(
  () => props.chartConfig.option.dataset,
  newData => {
    //console.log('led',  typeof newData, newData)
    option.dataset = parseData(newData, 'boolean')
  },
  {
    immediate: true
  }
)

const { dataset } = toRefs(props.chartConfig.option)

useChartDataFetch(props.chartConfig, useChartEditStore, (newVal: boolean) => {
  // @ts-ignore
  option.dataset = newVal
})
</script>

<style lang="scss" scoped>
svg {
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
