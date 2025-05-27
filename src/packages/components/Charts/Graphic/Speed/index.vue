<template>
  <!-- <div @click="onClick"> -->
  <img
    @click="onClick"
    v-if="option.dataset === speeds[1]"
    width="96"
    height="96"
    :src="SVG_ICON.card_icons.fanSpeed3"
  />
  <img
    @click="onClick"
    v-else-if="option.dataset === speeds[2]"
    width="96"
    height="96"
    :src="SVG_ICON.card_icons.fanSpeed2"
  />
  <img
    @click="onClick"
    v-else-if="option.dataset === speeds[3]"
    width="96"
    height="96"
    :src="SVG_ICON.card_icons.fanSpeed1"
  />
  <img v-else width="96" height="96" :src="SVG_ICON.card_icons.fanSpeedAuto" @click="onClick" />
  <!-- </div> -->
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

const { speeds } = toRefs(props.chartConfig.option)

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    //console.log('asdasd', newVal, speeds.value)
    option.dataset = parseData(newVal, 'string')
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
      let data = clickCyclicData(option.dataset, speeds.value)

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

<style lang="scss" scoped></style>
