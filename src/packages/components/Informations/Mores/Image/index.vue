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
import { PropType, watch, toRefs, ref, computed } from 'vue'
import { requireErrorImg } from '@/utils'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

// 解构属性
const { w, h } = toRefs(props.chartConfig.attr)
const { pictures, fit, borderRadius, dataset } = toRefs(props.chartConfig.option)

const value = ref('0')

// 核心计算：数学区间匹配 + 精确值匹配
const url = computed(() => {
  const currentVal = Number(parseData(value.value, 'string'))
  const imgList = pictures.value

  // 遍历匹配规则
  for (const item of imgList) {
    const rule = String(item.value || '').trim()
    if (!rule) continue

    // 匹配数学区间：(4,10] / [4,10) / [4,10] / (4,10)
    const intervalReg = /^([\(\[])(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)([\)\]])$/
    const match = rule.match(intervalReg)

    if (match) {
      const [, leftBracket, minStr, maxStr, rightBracket] = match
      const min = Number(minStr)
      const max = Number(maxStr)
      let inRange = false

      // 左边界
      inRange = leftBracket === '[' ? currentVal >= min : currentVal > min
      // 右边界
      inRange = rightBracket === ']' ? inRange && currentVal <= max : inRange && currentVal < max

      if (inRange) return item.url
      continue
    }

    // 精确值匹配
    const ruleVal = Number(rule)
    if (!isNaN(ruleVal) && currentVal === ruleVal) {
      //console.log(item.url)
      return item.url
    }
  }

  // 匹配不到 → 强制使用第一张图片（你确认一定存在）
  return imgList[0].url
})

// 样式
const getStyle = (radius: number) => ({
  borderRadius: `${radius}px`,
  overflow: 'hidden'
})

// 监听值更新
watch(
  () => props.chartConfig.option.datavalue,
  (newData) => {
    //console.log('picture', newData)
    value.value = parseData(newData, 'string')
  },
  { immediate: true }
)

// 监听 dataset 同步到第一张图片
watch(
  () => props.chartConfig.option.dataset,
  (newData) => {
    pictures.value[0].name = props.chartConfig.chartConfig.title
    pictures.value[0].url = newData
  },
  { immediate: true }
)
</script>