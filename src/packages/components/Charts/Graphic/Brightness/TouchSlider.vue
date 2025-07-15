<template>
  <div class="touch-slider">
    <div 
      ref="sliderRef"
      class="slider-track"
      :style="trackStyle"
      @mousedown="startDrag"
      @touchstart="startDrag"
      @mousemove="onDrag"
      @touchmove="onDrag"
      @mouseup="endDrag"
      @touchend="endDrag"
      @mouseleave="endDrag"
    >
      <div class="slider-progress" :style="progressStyle"></div>
      <div 
        class="slider-thumb" 
        :style="thumbStyle"
        @mousedown="startDrag"
        @touchstart="startDrag"
      >
        <span v-if="showPercent" class="percent-text">{{ progress }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: number
  height?: number
  thumbSize?: number
  barColor?: string
  thumbColor?: string
  trackColor?: string
  showPercent?: boolean
}>(), {
  height: 8,
  thumbSize: 24,
  barColor: '#42b983',
  thumbColor: '#ffffff',
  trackColor: '#e0e0e0',
  showPercent: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const sliderRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)

// 计算进度值（0-100）
const progress = computed(() => Math.min(100, Math.max(0, props.modelValue)))

// 计算进度条样式
const progressStyle = computed(() => ({
  width: `${progress.value}%`,
  backgroundColor: props.barColor,
  height: `${props.height}px`,
  borderRadius: `${props.height / 2}px`
}))

// 计算轨道样式
const trackStyle = computed(() => ({
  backgroundColor: props.trackColor,
  height: `${props.height}px`,
  borderRadius: `${props.height / 2}px`
}))

// 计算滑块样式
const thumbStyle = computed(() => ({
  width: `${props.thumbSize}px`,
  height: `${props.thumbSize}px`,
  backgroundColor: props.thumbColor,
  borderRadius: '50%',
  left: `calc(${progress.value}% - ${props.thumbSize / 2}px)`,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  transform: isDragging.value ? 'scale(1.2)' : 'scale(1)',
  transition: isDragging.value ? 'none' : 'all 0.2s ease'
}))

// 开始拖动
const startDrag = (event: MouseEvent | TouchEvent) => {
  isDragging.value = true
  updateProgress(event)
  event.preventDefault()
}

// 拖动中
const onDrag = (event: MouseEvent | TouchEvent) => {
  if (isDragging.value) {
    updateProgress(event)
  }
}

// 结束拖动
const endDrag = () => {
  if (isDragging.value) {
    isDragging.value = false
  }
}

// 更新进度值
const updateProgress = (event: MouseEvent | TouchEvent) => {
  if (!sliderRef.value) return
  
  const rect = sliderRef.value.getBoundingClientRect()
  let clientX: number
  
  if (event instanceof TouchEvent && event.touches.length > 0) {
    clientX = event.touches[0].clientX
  } else if (event instanceof MouseEvent) {
    clientX = event.clientX
  } else {
    return
  }
  
  let position = (clientX - rect.left) / rect.width
  position = Math.max(0, Math.min(1, position))
  
  const newValue = Math.round(position * 100)
  emit('update:modelValue', newValue)
}

// 添加全局事件监听器
const addGlobalListeners = () => {
  document.addEventListener('mousemove', onDrag as EventListener)
  document.addEventListener('touchmove', onDrag as EventListener, { passive: false })
  document.addEventListener('mouseup', endDrag)
  document.addEventListener('touchend', endDrag)
}

// 移除全局事件监听器
const removeGlobalListeners = () => {
  document.removeEventListener('mousemove', onDrag as EventListener)
  document.removeEventListener('touchmove', onDrag as EventListener)
  document.removeEventListener('mouseup', endDrag)
  document.removeEventListener('touchend', endDrag)
}

watch(isDragging, (newVal) => {
  if (newVal) {
    addGlobalListeners()
  } else {
    removeGlobalListeners()
  }
})

onUnmounted(() => {
  removeGlobalListeners()
})
</script>

<style scoped>
.touch-slider {
  width: 100%;
  position: relative;
  padding: 15px 0;
  cursor: pointer;
  user-select: none;
}

.slider-track {
  position: relative;
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: visible;
}

.slider-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 4px;
  transition: width 0.1s ease;
}

.slider-thumb {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  cursor: grab;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.slider-thumb:active {
  cursor: grabbing;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5) !important;
}

.slider-track:hover .slider-thumb {
  transform: translateY(-50%) scale(1.1);
}

.percent-text {
  font-size: 0.7em;
  color: #333;
  font-weight: bold;
  pointer-events: none;
}
</style>