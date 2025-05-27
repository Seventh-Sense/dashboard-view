<template>
  <label
    class="switch"
    :class="{
      'switch--checked': internalValue,
      'switch--disabled': disabled,
      'switch--animating': animating
    }"
    role="switch"
    :aria-checked="internalValue"
    :aria-disabled="disabled"
  >
    <input
      type="checkbox"
      class="switch-input"
      :checked="internalValue"
      :disabled="disabled"
      @change="handleChange"
      @keydown.space.prevent="handleKeyboardToggle"
    >
    <span 
      class="switch-slider"
      :style="sliderStyle"
    >
      <span class="switch-thumb"></span>
    </span>
    <span v-if="$slots.default" class="switch-label">
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  disabled?: boolean
  width?: number | string
  height?: number | string
}>(), {
  disabled: false,
  width: 50,
  height: 28
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const animating = ref(false)
const internalValue = ref(props.modelValue)

// 状态同步优化
watch(() => props.modelValue, (newVal) => {
  if (newVal !== internalValue.value) {
    internalValue.value = newVal
  }
})

// 样式计算
const sliderStyle = computed(() => ({
  '--switch-width': addUnit(props.width),
  '--switch-height': addUnit(props.height),
  '--thumb-size': `calc(${addUnit(props.height)} - 4px)`,
  '--thumb-translate': internalValue.value 
    ? 'translateX(calc(var(--switch-width) - var(--thumb-size) - 4px))' 
    : 'translateX(2px)'
}))

// 单位处理
const addUnit = (value?: string | number) => {
  if (typeof value === 'number') return `${value}px`
  if (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value)) return `${value}px`
  return value
}

// 事件处理优化
const handleChange = (e: Event) => {
  if (props.disabled || animating.value) return
  const target = e.target as HTMLInputElement
  startToggle(target.checked)
}

const handleKeyboardToggle = () => {
  if (props.disabled || animating.value) return
  startToggle()
}

// 状态切换逻辑重构
const startToggle = (value?: boolean) => {
  const newValue = typeof value === 'boolean' ? value : !internalValue.value
  
  animating.value = true
  internalValue.value = newValue
  
  // 立即提交状态变更
  emit('update:modelValue', newValue)
  emit('change', newValue)
  
  nextTick().then(() => {
    setTimeout(() => {
      animating.value = false
    }, 300)
  })
}
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.switch-input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  margin: 0;
  cursor: inherit;
  z-index: 1;
}

.switch-slider {
  position: relative;
  display: inline-block;
  width: var(--switch-width);
  height: var(--switch-height);
  background-color: #ccc;
  border-radius: calc(var(--switch-height) / 2);
  flex-shrink: 0;
  transition: background-color 0.3s ease;
}

.switch-thumb {
  position: absolute;
  top: 50%;
  width: var(--thumb-size);
  height: var(--thumb-size);
  background-color: white;
  border-radius: 50%;
  transform: translateY(-50%) var(--thumb-translate);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.switch--checked .switch-slider {
  background-color: #007bff;
}

.switch--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch--animating .switch-input {
  pointer-events: none;
}

.switch-label {
  margin-left: 8px;
  font-size: 14px;
}
</style>