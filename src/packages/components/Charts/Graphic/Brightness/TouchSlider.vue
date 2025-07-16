<template>
  <div
    class="slider-container"
    ref="container"
    @click="handleClick"
    @touchstart.passive="handleClick"
    :style="{
      height: height + 'px'
    }"
  >
    <div class="slider-track" :style="trackStyle">
      <div  class="slider-percent">{{ modelValue }}%</div>
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
    validator: (value: any) => value >= 0 && value <= 100
  },
  sliderColor: {
    type: String,
    default: '#6666FF'
  },
  height: {
    type: Number,
    default: '56'
  }
})

const emit = defineEmits(['update:modelValue'])

const container = ref<any>(null)
const isDragging = ref(false)

// 计算样式
const trackStyle = computed(() => ({
  width: `${props.modelValue}%`,
  background: props.sliderColor,
  '--theme-color': props.sliderColor
}))

const thumbStyle = computed(() => ({
  left: `${props.modelValue}%`,
  height: `${props.height}px`,
}))

// 开始拖动
const startDrag = (e: any) => {
  e.preventDefault()
  isDragging.value = true
  addDragListeners()
}

// 添加事件监听器
const addDragListeners = () => {
  document.addEventListener('touchmove', handleDrag)
  document.addEventListener('touchend', stopDrag)
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
}

// 处理拖动
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
  emit('update:modelValue', Math.round(newProgress))
}

// 停止拖动
const stopDrag = () => {
  isDragging.value = false
  removeDragListeners()
}

// 移除事件监听器
const removeDragListeners = () => {
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('touchend', stopDrag)
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 点击跳转
const handleClick = (e: any) => {
  if (!container.value) return

  const rect = container.value.getBoundingClientRect()
  const containerWidth = rect.width
  const offsetX = e.type.includes('touch')
    ? e.touches[0].clientX - rect.left
    : e.clientX - rect.left

  const newProgress = Math.max(0, Math.min(100, (offsetX / containerWidth) * 100))
  emit('update:modelValue', Math.round(newProgress))
}

// 组件卸载时清理事件监听
onUnmounted(() => {
  removeDragListeners()
})
</script>

<style scoped>
.slider-container {
  background: rgba(255, 255, 255, 0.2);
  height: 46px;
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
  background: rgba(102, 102, 255, 1);
  border-radius: 4px 0 0 4px;
  transition: width 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
}

.slider-percent {
  color: rgba(255, 255, 255, 1);
  font-weight: bold;
  font-size: 1.1rem;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  font-family: 'Courier New', monospace;
  font-weight: 800;
  min-width: 0px;
  text-align: right;
}

.slider-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 46px;
  background: white;
  border-radius: 4px;
  z-index: 10;
  transition: all 0.2s ease;
  cursor: grab;
}

.slider-thumb.active {
  transform: translate(-50%, -50%) scaleX(2.2);
  border-radius: 4px;
}
</style>
