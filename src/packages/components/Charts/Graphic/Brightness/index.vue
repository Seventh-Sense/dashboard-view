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
      <div  class="slider-percent">{{ value }}%</div>
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
const value = ref<any>(50)

const { w, h } = toRefs(props.chartConfig.attr)

const container = ref<any>(null)
const isDragging = ref(false)

const trackStyle = computed(() => ({
  width: `${value.value}%`,
  background: `#6666FF`,
  '--theme-color': `#6666FF`
}))

const thumbStyle = computed(() => ({
  left: `${value.value}%`,
  height: `${h}px`,
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

  const newProgress = Math.max(0, Math.min(100, (offsetX / containerWidth) * 100))
  value.value = Math.round(newProgress)
  onClick(Math.round(newProgress))
}

const handleClick = (e: any) => {
  if (!container.value) return

  const rect = container.value.getBoundingClientRect()
  const containerWidth = rect.width
  const offsetX = e.type.includes('touch')
    ? e.touches[0].clientX - rect.left
    : e.clientX - rect.left

  const newProgress = Math.max(0, Math.min(100, (offsetX / containerWidth) * 100))
  
  value.value = Math.round(newProgress)
  onClick(Math.round(newProgress))
}

const stopDrag = () => {
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

<style lang="scss" scoped>
.slider-container {
  background: rgba(255, 255, 255, 0.2);
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
  height: 100%;
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
