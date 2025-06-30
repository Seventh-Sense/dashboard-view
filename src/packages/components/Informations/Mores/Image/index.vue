<template>
  <div :style="getStyle(borderRadius)">
    <n-image
      :object-fit="fit"
      preview-disabled
      :src="url"
      :fallback-src="requireErrorImg()"
      :width="w"
      :height="h"
      lazy
    />
  </div>
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch, toRefs, ref, computed } from 'vue'
import { requireErrorImg } from '@/utils'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { w, h } = toRefs(props.chartConfig.attr)
const { pictures, fit, borderRadius, dataset } = toRefs(props.chartConfig.option)

const option = shallowReactive({
  dataset: ''
})

const value = ref('0')
const url = computed(() => {
  // 如果 pictures 数组不为空，则返回匹配的 URL，否则返回默认图片
  if (pictures && pictures.value && pictures.value.length > 0) {
    const matched = pictures.value.find((item: any) => item.value === value.value)
    return matched?.url || pictures.value[0].url
  }
  
  return dataset!.value
})

const getStyle = (radius: number) => {
  return {
    borderRadius: `${radius}px`,
    overflow: 'hidden'
  }
}

// 编辑更新
watch(
  () => props.chartConfig.option.datavalue,
  (newData: any) => {
    value.value = parseData(newData, 'string')
  },
  {
    immediate: true
  }
)

watch(
  () => props.chartConfig.option.dataset,
  (newData: any) => {
    if (pictures && pictures.value[0].url) {
      pictures.value[0].url = newData
    }
  },
  {
    immediate: true
  }
)
</script>
