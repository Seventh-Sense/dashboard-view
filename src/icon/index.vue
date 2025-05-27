<template>
  <span class="fa-stack" :style="sizeStyle">
    <i
      :class="['xicon_' + name + '_FL']"
      class="fa-stack-1x"
      :style="[fontSizeStyle, { color: 'var(--color-font-default)' }]"
    ></i>
    <i
      :class="['xicon_' + name + '_HL']"
      class="fa-stack-1x"
      :style="[fontSizeStyle, { color: color?.normal || 'var(--color-primary)' }]"
    ></i>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    active?: boolean
    disabled?: boolean
    size?: number
    type?: 'default' | 'menu' | 'mono-line' | 'mono-filled' | 'color-white' | 'no-background'
    color?: {
      normal: string
      active?: string
      disabled?: string
      activeDisabled?: string
    }
    title?: string
  }>(),
  {
    size: 32,
    type: 'default'
  }
)

const sizeStyle = ref({
  width: props.size + 'px',
  height: props.size + 'px',
  lineHeight: props.size + 'px'
})
const fontSizeStyle = ref({ fontSize: props.size + 'px' })
</script>

<style lang="scss" scoped></style>
