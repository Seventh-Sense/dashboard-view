<template>
  <div
    class="container"
    :style="{
      width: w + 'px',
      height: h + 'px',
      background: value === active_value ? active_bgColor : inactive_bgColor,
      borderRadius: radius + 'px',
      backdropFilter: 'blur(' + filter + 'px)'
    }"
  >
    <Icon
      :name="icon"
      type="color-white"
      :size="icon_size"
      :color="{ normal: 'white' }"
      @click="onClick()"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch, toRefs, ref, computed } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'
import { Icon } from '@/icon/index'
import { cloneDeep } from 'lodash'
import throttle from 'lodash/throttle'
import { throttleTime, updateNodeData } from '@/packages/public'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const t = window['$t']
const value = ref<any>('0')
const flag = ref(false)
const { inactive_bgColor, active_bgColor, icon_size, icon, radius, filter, active_value } = toRefs(
  props.chartConfig.option
)

const { w, h } = toRefs(props.chartConfig.attr)

const onClick = throttle(
  async () => {
    try {
      flag.value = true

      let data = active_value.value

      let tmp = cloneDeep(value.value)

      value.value = parseData(data, 'string')

      let result = await updateNodeData(props.chartConfig?.request?.bindParams, Number(data))
      if (!result) {
        value.value = tmp
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
  justify-content: center;
  align-items: center;
}
</style>
