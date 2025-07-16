<template>
  <TouchSlider v-model="value" sliderColor="#6666FF" :height="h" />
</template>

<script setup lang="ts">
import TouchSlider from './TouchSlider.vue'
import { PropType, watch, toRefs, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'
import { throttleTime, updateNodeData } from '@/packages/public'
import { cloneDeep } from 'lodash'
import throttle from 'lodash/throttle'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const flag = ref(false)
const t = window['$t']
const value = ref<any>(50)

const { w, h } = toRefs(props.chartConfig.attr)

const onClick = throttle(
  async (data: number) => {
    try {
      flag.value = true

      let result = await updateNodeData(props.chartConfig?.request?.bindParams, Number(data))
      if (!result) {
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
  () => value.value,
  newVal => {
    console.log('触发更新', newVal)
    onClick(newVal)
  },
  {
    deep: true
  }
)

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    if (!flag.value) {
      value.value = parseData(newVal, 'number')
    }
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss" scoped></style>
