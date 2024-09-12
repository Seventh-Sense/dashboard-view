<template>
  <div class="go-switch">
    <n-switch v-model:value="option.dataset" :size="size" :round="round" :disabled="disabled" />
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs, shallowReactive, watch } from 'vue'
import { CreateComponentType } from '../../../../../packages/index.d'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { w, h } = toRefs(props.chartConfig.attr)
const { size, round, disabled } = toRefs(props.chartConfig.option)

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
</script>

<style lang="scss" scoped>
@include go('switch') {
  display: flex;
  align-items: center;
  justify-content: center;
  width: v-bind('`${w}px`');
  height: v-bind('`${h}px`');
}
</style>
