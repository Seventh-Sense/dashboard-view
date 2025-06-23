<template>
  <svg :width="w" :height="h" :viewBox="`0 0 ${w} ${h}`">
    <circle
      :cx="w / 2"
      :cy="h / 2"
      :r="(h - 8) / 2"
      :fill="backgroundColor"
      :stroke="borderColor"
      stroke-width="1"
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
const { backgroundColor, borderColor } = toRefs(props.chartConfig.option)
</script>

<style lang="scss" scoped>
svg {
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
  backdrop-filter: blur(50px);
}
</style>
