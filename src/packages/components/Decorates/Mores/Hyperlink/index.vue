<template>
  <div
    class="button"
    :style="{
      width: w + 'px',
      height: h + 'px',
      borderRadius: radius + 'px',
      backgroundColor: backgroundColor
    }"
    @click="onClick"
  >
    <span
      :style="{
        fontSize: fontSize + 'px',
        color: fontColor
      }"
    >
      {{ text }}
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
const { backgroundColor, href, text, fontSize, fontColor, radius } = toRefs(
  props.chartConfig.option
)

const onClick = () => {
  if (href.value !== '') {
    window.location.href = href.value
  }
}
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
