<template>
  <div
    class="container"
    :style="{
      width: w + 'px',
      height: h + 'px',
      background: inactive_bgColor
    }"
  >
    <Icon :name="icon" :size="icon_size" />
  </div>
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch, toRefs, ref, computed } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'
import { Icon } from '@/icon/index'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const t = window['$t']
const value = ref<any>(26)

const { inactive_bgColor, active_bgColor, icon_size, icon, radius, filter } = toRefs(
  props.chartConfig.option
)

const { w, h } = toRefs(props.chartConfig.attr)
</script>

<style lang="scss" scoped>
.container {
  border-radius: 6px;
  backdrop-filter: blur(32px);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
