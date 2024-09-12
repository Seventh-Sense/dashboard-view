<template>
  <div class="loading-container">
    <img width="96" height="96" :src="SVG_ICON.card_icons.loading" />
  </div>
</template>

<script setup lang="ts">
import SVG_ICON from '@/svg/SVG_ICON'
</script>

<style lang="scss" scoped>
// svg {
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
// }

.loading-container {
  background-color: #383477;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
