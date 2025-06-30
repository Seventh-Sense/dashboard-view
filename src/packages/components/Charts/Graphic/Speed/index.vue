<template>
  <!-- <div @click="onClick"> -->
  <Icon v-if="value === speeds[1]" name="fanSpeed3" type="mono-line" :size="h" @click="onClick" />
  <Icon
    v-else-if="value === speeds[2]"
    name="fanSpeed2"
    type="mono-line"
    :size="h"
    @click="onClick"
  />
  <Icon
    v-else-if="value === speeds[3]"
    name="fanSpeed1"
    type="mono-line"
    :size="h"
    @click="onClick"
  />
  <Icon v-else name="fanSpeedAuto" :size="h" @click="onClick" />
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch, toRefs, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'
import throttle from 'lodash/throttle'
import { updateNodeData, clickCyclicData, throttleTime } from '@/packages/public'
import { cloneDeep } from 'lodash'
import { Icon } from '@/icon/index'

const t = window['$t']

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const flag = ref(false)
const option = shallowReactive({
  dataset: '0'
})
const value = ref('0')

const { speeds, size } = toRefs(props.chartConfig.option)
const { w, h } = toRefs(props.chartConfig.attr)

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

const onClick = throttle(
  async () => {
    try {
      flag.value = true
      let data = clickCyclicData(value.value, speeds.value)

      let tmp = cloneDeep(value.value)
      value.value = parseData(data, 'string')

      //console.log(value.value, data, speeds.value)

      let result = await updateNodeData(props.chartConfig?.request?.bindParams, Number(data))
      if (!result) {
        value.value = tmp
      }
    } catch (error) {
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
</script>

<style lang="scss" scoped>
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
