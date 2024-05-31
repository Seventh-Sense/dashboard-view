<template>
  <svg
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 80 160"
  >
    <defs>
      <linearGradient v-if="open" id="gradient1" x1="0" y1="80" x2="80" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#6662" />
        <stop offset="1" stop-color="#fff2" />
      </linearGradient>
      <linearGradient v-else id="gradient1" x1="0" y1="80" x2="80" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#fff9" />
        <stop offset="1" stop-color="#fff" />
      </linearGradient>
    </defs>
    <rect
      x="0"
      width="80"
      height="160"
      rx="40"
      ry="40"
      style="fill: url(#gradient1); stroke-width: 0px"
    />
  </svg>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue'
import { CreateComponentType } from '../../../../../packages/index.d'
import { useChartDataFetch } from '../../../../../hooks/useChartDataFetch.hook'
import { useChartEditStore } from '../../../../../store/modules/chartEditStore/chartEditStore'
import { OptionType } from './config'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const open = ref(false)

const updateDatasetHandler = (newVal: string | number) => {
  console.log(newVal)
  if (typeof newVal === 'string') {
    open.value = false
  } else if (typeof newVal === 'number') {
    if (newVal > 10) {
      open.value = true
    } else {
      open.value = false
    }
  }
}

watch(
  () => props.chartConfig.option,
  newVal => {
    try {
      updateDatasetHandler((newVal as any as OptionType).dataset)
    } catch (error) {
      console.log(error)
    }
  },
  {
    immediate: true,
    deep: true
  }
)

useChartDataFetch(props.chartConfig, useChartEditStore, (newVal: string | number) => {
  // @ts-ignore
  updateDatasetHandler(newVal)
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
