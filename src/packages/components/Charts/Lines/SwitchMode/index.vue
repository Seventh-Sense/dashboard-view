<template>
  <n-switch
    v-model:value="option.dataset"
    :rail-style="railStyle"
    @update:value="handleSwitchChange"
  />
</template>

<script setup lang="ts">
import { PropType, toRefs, shallowReactive, watch, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'
import { message } from 'ant-design-vue'
import throttle from 'lodash/throttle'
import { throttleTime, updateNodeData } from '@/packages/public'
import { cloneDeep } from 'lodash'
import type { CSSProperties } from 'vue'
import { setSwitchModeValue } from '@/views/display/util/util'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { mode } = toRefs(props.chartConfig.option)

const option = shallowReactive({
  dataset: false
})

function railStyle({ focused, checked }: { focused: boolean; checked: boolean }) {
  const style: CSSProperties = {}
  if (checked) {
    style.background = '#2080f0'
  } else {
    style.background = '#00000021'
  }
  return style
}

const handleSwitchChange = throttle(
  async (value: boolean) => {
    console.log('开关切换:', value)
    const sendData = value ? 0 : 1

    try {
      setSwitchModeValue(mode.value)

      if (value) {
        if (mode.value === 1) {
          message.success('舒适模式开启')
        }

        if (mode.value === 2) {
          message.success('节能模式开启')
        }

        if (mode.value === 3) {
          message.success('智能模式开启')
        }
      }
    } catch (error) {
      // 错误已由 updateNodeData 处理，此处可补充额外逻辑
      console.error('操作失败:', error)
      option.dataset = !value
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
    console.log('getSwitchMode',newVal)
    if (newVal === mode.value) {
      option.dataset = true
    } else {
      option.dataset = false
    }
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss" scoped></style>
