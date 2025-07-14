<template>
  <svg :width="w" :height="h">
    <rect
      x="0"
      :width="w"
      :height="h"
      :rx="radius"
      :ry="radius"
      :fill="backgroundColor"
      :fill-opacity="opacity"
      style="stroke-width: 0px"
    />
  </svg>
</template>

<script setup lang="ts">
import { PropType, toRefs } from 'vue'
import { CreateComponentType } from '../../../../../packages/index.d'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { w, h } = toRefs(props.chartConfig.attr)
const { radius, backgroundColor, opacity } = toRefs(props.chartConfig.option)
</script>

<style lang="scss" scoped>
svg {
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
  backdrop-filter: blur(32px);
  background-color: transparent;
}
</style>
