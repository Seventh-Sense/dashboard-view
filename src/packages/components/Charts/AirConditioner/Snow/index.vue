<template>
  <Icon v-if="option.dataset === on_value" name="snow" :size="w" @click="onClick" />
  <Icon
    v-else
    name="snow"
    :size="w"
    type="mono-line"
    :color="{ normal: '#FFFFFFFF' }"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch, ref, toRefs } from 'vue'
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

const option = shallowReactive({
  dataset: 0
})
const { w, h } = toRefs(props.chartConfig.attr)
const { on_color, off_color, on_value } = toRefs(props.chartConfig.option)

const onClick = throttle(
  async () => {
    try {
      flag.value = true
      let data = on_value.value

      let tmp = cloneDeep(option.dataset)
      option.dataset = parseData(data, 'number')

      let result = await updateNodeData(props.chartConfig?.request?.bindParams, Number(data))
      if (!result) {
        option.dataset = tmp
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

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    option.dataset = parseData(newVal, 'number')
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss" scoped></style>
