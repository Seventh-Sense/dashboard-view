<template>
  <img
    v-if="option.dataset === modes[0]"
    width="96"
    height="96"
    :src="SVG_ICON.card_icons.snow"
    @click="onClick"
  />
  <img
    v-else
    width="96"
    height="96"
    :src="SVG_ICON.card_icons.sun"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import SVG_ICON from '@/svg/SVG_ICON'
import { PropType, shallowReactive, watch, toRefs, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'
import throttle from 'lodash/throttle'
import { updateNodeData, clickCyclicData, throttleTime } from '@/packages/public'
import { cloneDeep } from 'lodash'

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

const { modes } = toRefs(props.chartConfig.option)

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    if (!flag.value) {
      option.dataset = parseData(newVal, 'string')
    }
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
      let data = clickCyclicData(option.dataset, modes.value)

      let tmp = cloneDeep(option.dataset)

      option.dataset = parseData(data, 'string')

      let result = await updateNodeData(props.chartConfig?.request?.bindParams, Number(data))
      if (!result) {
        option.dataset = tmp
      }
    } catch (error) {
      // 错误已由 updateNodeData 处理，此处可补充额外逻辑
      console.error('操作失败:', error)
    } finally {
      flag.value = false // 无论成功失败都关闭加载状态
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
</style>
