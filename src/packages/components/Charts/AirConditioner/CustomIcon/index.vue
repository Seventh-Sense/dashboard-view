<template>
  <div
    class="container"
    :style="{
      width: w + 'px',
      height: h + 'px',
      background: value === avtive_value ? avtive_background : inavtive_background,
      borderColor: border_color
    }"
    @click="onClick()"
  >
    <Icon :name="icon" :size="icon_size" />
  </div>
</template>

<script setup lang="ts">
import { PropType, watch, toRefs, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'
import { Icon } from '@/icon/index'
import throttle from 'lodash/throttle'
import { updateNodeData, throttleTime } from '@/packages/public'
import cloneDeep from 'lodash/cloneDeep'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const flag = ref(false)
const t = window['$t']

const value = ref<string>('0')

const {
  icon,
  icon_size,
  avtive_value,
  inavtive_value,
  avtive_background,
  inavtive_background,
  border_color
} = toRefs(props.chartConfig.option)

const { w, h } = toRefs(props.chartConfig.attr)

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

const onClick = throttle(
  async () => {
    try {
      flag.value = true

      let data = value.value === avtive_value.value ? inavtive_value.value : avtive_value.value

      let tmp = cloneDeep(value.value)
      value.value = parseData(data, 'string')

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
.container {
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.13);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
