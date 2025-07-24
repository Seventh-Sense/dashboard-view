<template>
  <div
  class="container"
    :style="{
      width: w + 'px',
      height: h + 'px',
      borderRadius: radius + 'px',
      backgroundColor: backgroundColor,
      backdropFilter: 'blur(' + filter + 'px)'
    }"
  >
    <span
      v-if="isTitle"
      :style="{
        fontSize: title_size + 'px',
        color: title_color
      }"
    >
      {{ title_content }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs } from 'vue'
import { CreateComponentType } from '@/packages/index.d'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { w, h } = toRefs(props.chartConfig.attr)

const { radius, backgroundColor, filter, isTitle, title_color, title_content, title_size } = toRefs(
  props.chartConfig.option
)
</script>

<style lang="scss" scoped>
.container {
    padding: 12px;
}
</style>
