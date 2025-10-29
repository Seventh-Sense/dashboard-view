<template>
  <div
    class="slider-container"
    ref="container"
    @click="handleClick"
    @touchstart.passive="handleClick"
    :style="{
      height: h + 'px'
    }"
  >
    <div class="slider-track" :style="trackStyle"></div>
    <div class="slider-percent">{{ displayValue }}%</div>
    <div
      class="slider-thumb"
      :class="{ active: isDragging }"
      :style="thumbStyle"
      @touchstart="startDrag"
      @mousedown="startDrag"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { PropType, watch, toRefs, ref, computed, onUnmounted } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'
import { throttleTime, updateNodeData } from '@/packages/public'
import throttle from 'lodash/throttle'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const flag = ref(false)
const t = window['$t']
const value = ref<number>(50) // 精确值，用于计算位置
const finalValue = ref<number>(50) // 最终确认值，用于下发
const previousValue = ref<number | null>(null) // 记录上一次的值
const originalValue = ref<number>(50) // 记录操作前的原始值，用于失败回退

// 显示用的值，保留整数
const displayValue = computed(() => {
  return Number(value.value.toFixed(0))
})

const { w, h } = toRefs(props.chartConfig.attr)
const { background_color, thumb_color, track_color, percent_color } = toRefs(
  props.chartConfig.option
)

const container = ref<any>(null)
const isDragging = ref(false)
const lastSentValue = ref<number | null>(null) // 记录最后一次下发的值

const trackStyle = computed(() => ({
  width: `${value.value}%`,
  background: `${track_color.value}`,
  '--theme-color': `${track_color.value}`
}))

const thumbStyle = computed(() => ({
  left: `${value.value}%`,
  height: `${h.value}px`
}))

const startDrag = (e: any) => {
  e.preventDefault()
  isDragging.value = true
  // 记录开始拖动时的原始值（关键：确保拖动前的值被保存）
  originalValue.value = value.value
  addDragListeners()
}

const addDragListeners = () => {
  document.addEventListener('touchmove', handleDrag)
  document.addEventListener('touchend', stopDrag)
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
}

const handleDrag = (e: any) => {
  if (!isDragging.value || !container.value) return

  const rect = container.value.getBoundingClientRect()
  const containerWidth = rect.width
  let offsetX = 0

  if (e.type.includes('touch')) {
    offsetX = e.touches[0].clientX - rect.left
  } else {
    offsetX = e.clientX - rect.left
  }

  const newProgress = Math.max(0, Math.min(100, (offsetX / containerWidth) * 100))
  value.value = Number(newProgress.toFixed(2))
}

const handleClick = (e: any) => {
  if (!container.value || isDragging.value) return

  const rect = container.value.getBoundingClientRect()
  const containerWidth = rect.width
  const offsetX = e.type.includes('touch')
    ? e.touches[0].clientX - rect.left
    : e.clientX - rect.left

  const newProgress = Math.max(0, Math.min(100, (offsetX / containerWidth) * 100))
  const roundedProgress = Math.round(newProgress)
  
  // 记录点击前的原始值
  originalValue.value = value.value
  value.value = roundedProgress
  finalValue.value = roundedProgress
  sendValue(roundedProgress)
}

const stopDrag = () => {
  if (!isDragging.value) return

  if (container.value) {
    const roundedProgress = Math.round(value.value)
    // 拖动结束时记录当前值作为可能的提交值，但保留原始值用于回退
    value.value = roundedProgress
    finalValue.value = roundedProgress
    sendValue(roundedProgress)
  }

  isDragging.value = false
  removeDragListeners()
}

const removeDragListeners = () => {
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('touchend', stopDrag)
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

onUnmounted(() => {
  removeDragListeners()
})

const sendValue = (data: number) => {
  if (data !== lastSentValue.value) {
    lastSentValue.value = data
    onClick(data)
  }
}

const onClick = throttle(
  async (data: number) => {
    try {
      flag.value = true
      // 保存当前要提交的值，用于回退检查
      const pendingValue = data
      const result = await updateNodeData(props.chartConfig?.request, Number(data))
      
      if (!result) {
        console.log('更新失败，回退到原始值:', originalValue.value)
        // 回退所有相关值
        value.value = originalValue.value
        finalValue.value = originalValue.value
        lastSentValue.value = originalValue.value
      }
    } catch (error) {
      console.error('操作失败:', error)
      // 异常时同样回退
      value.value = originalValue.value
      finalValue.value = originalValue.value
      lastSentValue.value = originalValue.value
    } finally {
      flag.value = false
    }
  },
  throttleTime,
  {
    leading: false,
    trailing: true
  }
)

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    console.log('监听到数据集变化:', newVal)
    if (!flag.value) {
      const parsedValue = parseData(newVal, 'number')
      value.value = parsedValue
      // 同步更新原始值为最新的数据集值
      originalValue.value = parsedValue
    }
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss" scoped>
.slider-container {
  background: v-bind('background_color');
  height: 100%;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  padding-right: 40px;
  box-sizing: border-box;
}

.slider-track {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: v-bind('track_color');
  border-radius: 4px 0 0 4px;
  transition: width 0.2s ease;
}

.slider-percent {
  color: v-bind('percent_color');
  font-weight: bold;
  font-size: 1.1rem;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  font-family: 'Courier New', monospace;
  font-weight: 800;
  min-width: 30px;
  text-align: right;
}

.slider-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 100%;
  background: v-bind('thumb_color');
  border-radius: 4px;
  z-index: 10;
  transition: all 0.2s ease;
  cursor: grab;
}

.slider-thumb.active {
  transform: translate(-50%, -50%) scaleX(2.2);
  border-radius: 4px;
  cursor: grabbing;
}
</style>