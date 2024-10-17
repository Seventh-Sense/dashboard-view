<template>
  <img v-if="option.dataset" width="96" height="96" :src="SVG_ICON.card_icons.dry_TF" />
  <img v-else width="96" height="96" :src="SVG_ICON.card_icons.dry_TL" />
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch } from 'vue'
import { CreateComponentType } from '../../../../../packages/index.d'
import { useChartDataFetch } from '../../../../../hooks/useChartDataFetch.hook'
import { useChartEditStore } from '../../../../../store/modules/chartEditStore/chartEditStore'
import SVG_ICON from '../../../../../svg/SVG_ICON'
import { parseData } from '@/utils'

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
</style>
