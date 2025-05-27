<template>
  <svg
    id="TL"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    style="cursor: pointer"
    @click="onClick"
  >
    <path
      d="M12,8.25c-.36,0-.65-.29-.65-.65V2.6c0-.36.29-.65.65-.65s.65.29.65.65v5c0,.36-.29.65-.65.65Z"
      style="stroke-width: 0px"
      :style="{
        fill: option.dataset ? on : off
      }"
    />
    <path
      d="M12,22.05c-5.54,0-10.05-4.51-10.05-10.05C1.95,7.69,4.7,3.86,8.79,2.48c.34-.12.71.07.82.41.11.34-.07.71-.41.82-3.56,1.2-5.96,4.53-5.96,8.29,0,4.82,3.92,8.75,8.75,8.75s8.75-3.93,8.75-8.75c0-3.76-2.39-7.09-5.96-8.29-.34-.11-.52-.48-.41-.82s.48-.52.82-.41c4.09,1.38,6.84,5.2,6.84,9.52,0,5.54-4.51,10.05-10.05,10.05Z"
      style="stroke-width: 0px"
      :style="{
        fill: option.dataset ? on : off
      }"
    />
  </svg>
</template>

<script setup lang="ts">
import { PropType, toRefs, shallowReactive, watch, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import throttle from 'lodash/throttle'
import { parseData } from '@/utils'
import { animationTime, throttleTime, updateNodeData } from '@/packages/public'
import { cloneDeep } from 'lodash'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { w, h } = toRefs(props.chartConfig.attr)
const { on, off } = toRefs(props.chartConfig.option)

const option = shallowReactive({
  dataset: false
})
const flag = ref(false)
const t = window['$t']

const onClick = throttle(
  async () => {
    try {
      flag.value = true
      let data = option.dataset ? 0 : 1

      let tmp = cloneDeep(option.dataset)
      option.dataset = parseData(data, 'boolean')

      let result = await updateNodeData(props.chartConfig?.request?.bindParams, Number(data))
      if (!result) {
        option.dataset = tmp
      }
    } catch (error) {
      // 错误已由 updateNodeData 处理，此处可补充额外逻辑
      console.error('操作失败:', error)
    } finally {
      flag.value = false
    }
  },
  throttleTime,
  {
    leading: true,
    trailing: false
  }
)

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    if (!flag.value) {
      option.dataset = parseData(newVal, 'boolean')
    }
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

.blink-svg {
  animation: blink 1s infinite; /* 动画持续时间为1秒，无限次重复 */
}

@keyframes blink {
  0%,
  100% {
    opacity: 1; /* 完全不透明 */
  }
  50% {
    opacity: 0; /* 完全透明 */
  }
}
</style>
