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
    <div class="slider-track" :style="trackStyle">
      <!-- 显示时保留一位小数，避免过长小数 -->
      <div class="slider-percent">{{ displayValue }}%</div>
    </div>
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
const value = ref<number>(50) // 精确值，用于计算位置
const finalValue = ref<number>(50) // 最终确认值，用于下发
const previousValue = ref<number | null>(null) // 新增：记录上一次的值

// 显示用的值，保留一位小数
const displayValue = computed(() => {
  return Number(value.value.toFixed(0))
})

const { w, h } = toRefs(props.chartConfig.attr)
const { background_color, thumb_color, track_color, percent_color } = toRefs(props.chartConfig.option)

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

  // 计算精确值但限制小数位数
  const newProgress = Math.max(0, Math.min(100, (offsetX / containerWidth) * 100))
  value.value = Number(newProgress.toFixed(2)) // 限制为两位小数用于计算
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

  value.value = roundedProgress
  finalValue.value = roundedProgress
  sendValue(roundedProgress)
}

const stopDrag = () => {
  if (!isDragging.value) return

  if (container.value) {
    // 拖动结束时计算最终值
    const roundedProgress = Math.round(value.value)

    value.value = roundedProgress
    finalValue.value = roundedProgress
    sendValue(roundedProgress) // 只在结束时发送一次
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

// 发送值的函数，增加值变化检查
const sendValue = (data: number) => {
  // 只有当值发生变化时才发送
  if (data !== lastSentValue.value) {
    lastSentValue.value = data
    onClick(data)
  }
}

// 优化节流设置，避免重复下发
const onClick = throttle(
  async (data: number) => {
    try {
      flag.value = true
      let result = await updateNodeData(props.chartConfig?.request?.bindParams, Number(data))
      if (!result) {
        // 失败处理
      }
    } catch (error) {
      console.error('操作失败:', error)
    } finally {
      flag.value = false
    }
  },
  throttleTime,
  {
    leading: false, // 关闭首触发
    trailing: true // 只在结束时触发一次
  }
)

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    if (!flag.value) {
      const parsedValue = parseData(newVal, 'number')
      // 新增：检查当前值与上一次值是否一致
      if (parsedValue === previousValue.value) {
        // 连续两次值一致，才更新
        value.value = parsedValue
        finalValue.value = parsedValue
        lastSentValue.value = parsedValue
      } else {
        // 不一致时，只更新上一次值的记录，不更新实际值
        previousValue.value = parsedValue
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss" scoped>
/* 样式保持不变 */
.slider-container {
  background: v-bind('background_color');
  height: 100%;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.slider-track {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: v-bind('track_color');
  border-radius: 4px 0 0 4px;
  transition: width 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
}

.slider-percent {
  color: v-bind('thumb_color');
  font-weight: bold;
  font-size: 1.1rem;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  font-family: 'Courier New', monospace;
  font-weight: 800;
  min-width: 0px;
  text-align: center;
  padding-right: 8px;
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
