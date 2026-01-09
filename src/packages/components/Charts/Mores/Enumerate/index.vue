<template>
  <div
    class="container"
    :style="{
      color: color,
      fontSize: fontSize + 'px',
      height: h + 'px'
    }"
  >
    <div class="digit-style">{{ transalteText(value) }}</div>
  </div>
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

const value = ref('0')

const { fontSize, color, textAlign } = toRefs(props.chartConfig.option)
const { w, h } = toRefs(props.chartConfig.attr)

const transalteText = (data: string) => {
  const options = props.chartConfig.option.options || []

  if (data == null || data === '' || data === undefined) {
    return 'null'
  }

  if (options.length === 0) {
    return data
  }

  const matchedItem = options.find((item: any) => item.value === data)

  return matchedItem?.label || data
}

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    value.value = parseData(newVal, 'string')
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: v-bind('textAlign');
  align-items: center;
  gap: 8px;
  font-weight: bold;
}
</style>
