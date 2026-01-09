<template>
  <div
    :style="{
      width: w + 'px',
      height: h + 'px',
      borderRadius: radius + 'px',
      backgroundColor: backgroundColor
    }"
    @click="onClick"
  ></div>
</template>

<script setup lang="ts">
import { PropType, toRefs } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import throttle from 'lodash/throttle'
import { throttleTime, updateNodeData } from '@/packages/public'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { w, h } = toRefs(props.chartConfig.attr)
const { backgroundColor, radius, active_value } = toRefs(props.chartConfig.option)

const onClick = throttle(
  async () => {
    //console.log('点击事件触发', props.chartConfig.option.active_value)
    try {
      let result = await updateNodeData(
        props.chartConfig?.request,
        Number(props.chartConfig.option.active_value)
      )
    } catch (error) {
      // 错误已由 updateNodeData 处理，此处可补充额外逻辑
      console.error('操作失败:', error)
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
