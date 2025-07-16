<template>
  <div class="floating-icon" @click="handleIconClick">
    <!-- 或使用图片 -->
    <!-- <Icon name="logo" type="mono-filled" :size="48" style="cursor: pointer;"/> -->
    <!-- <img :width="48" :height="48" :src="SVG_ICON.card_icons.logo" /> -->
    <div style="width: 48px; height: 48px"></div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@/icon/index'
import SVG_ICON from '@/svg/SVG_ICON'

const emit = defineEmits(['click'])

const handleIconClick = () => {
  console.log('悬浮图标被点击')
  emit('click')
}
</script>

<style lang="scss" scoped>
.floating-icon {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
}
</style>
