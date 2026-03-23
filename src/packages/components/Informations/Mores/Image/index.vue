<template>
  <div :style="containerStyle">
    <n-image
      :object-fit="fit"
      preview-disabled
      :src="imgUrl"
      :fallback-src="requireErrorImg()"
      :width="w"
      :height="h"
      lazy
    />
  </div>
</template>

<script setup lang="ts">
import { PropType, watch, toRefs, ref, computed } from 'vue'
import { requireErrorImg } from '@/utils'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'

interface PictureItem {
  key: number
  url: string
  name: string
  value: number | { min: number; max: number }
}

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { w, h } = toRefs(props.chartConfig.attr)
const { pictures, fit, borderRadius, dataset } = toRefs(props.chartConfig.option)

const currentValue = ref<string | number>('0')

const containerStyle = computed(() => ({
  borderRadius: `${borderRadius.value ?? 0}px`,
  overflow: 'hidden'
}))

const imgUrl = computed(() => {
  const picList = pictures.value as PictureItem[]
  const defaultUrl = picList[0].url

  // 转为数字类型进行范围判断
  const numValue = Number(currentValue.value)

  if (isNaN(numValue)) return defaultUrl

  const matchedPic = picList.find(item => {
    const val = item.value

    // 范围配置
    if (typeof val === 'object' && val !== null) {
      const min = Number(val.min)
      const max = Number(val.max)

      // 关键：支持 min = max
      if (min === max) return numValue === min
      return numValue >= min && numValue <= max
    }

    // 精确值匹配
    return String(val) === String(numValue)
  })

  // 找到返回对应url，没找到返回第一张 / 默认图片
  return matchedPic?.url || defaultUrl
})

// 编辑更新
watch(
  () => props.chartConfig.option.datavalue,
  (newData: any) => {
    currentValue.value = parseData(newData, 'string')
  },
  {
    immediate: true
  }
)

// 监听上传图片 → 同步到第一张图
watch(
  () => props.chartConfig.option.dataset,
  (newUrl: any) => {
    if (!newUrl) return
    const firstPic = (pictures.value as PictureItem[])[0]
    firstPic.url = newUrl
    firstPic.name = props.chartConfig.chartConfig?.title || 'image'
  },
  {
    immediate: true
  }
)
</script>
