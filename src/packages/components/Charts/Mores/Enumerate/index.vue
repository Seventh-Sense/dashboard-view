<template>
  <div
    class="container"
    :style="{
      color: textColor,
      fontSize: fontSize + 'px',
      height: h + 'px'
    }"
  >
    <div class="digit-style">{{ textDisplay }}</div>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs, watch, ref, computed } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { isRealValue, parseData } from '@/utils'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const value = ref('0')

const { fontSize, color, textAlign } = toRefs(props.chartConfig.option)
const { w, h } = toRefs(props.chartConfig.attr)

const textInfo = computed(() => {
  const data = value.value
  const options = props.chartConfig.option.options || []

  // 空值处理
  if (data == null || data === '') {
    return { display: 'null', color: color.value }
  }

  // 匹配选项
  const match = options.find((item: any) => item.value === data)
  return {
    display: match?.label || data,
    color: match?.color || color.value
  }
})

const textDisplay = computed(() => textInfo.value.display)
const textColor = computed(() => textInfo.value.color)

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    if (isRealValue(newVal)) {
      value.value = parseData(newVal, 'string')
    }
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
