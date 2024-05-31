<template>
  <div class="card-outer">
    <div class="left-style">
      <span class="right-text text-style">健康</span>
    </div>
    <div>
      <img width="96" height="96" :src="SVG_ICON.card_icons.green_alarm"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import SVG_ICON from '@/svg/SVG_ICON'
</script>

<style lang="scss" scoped>
@import '../../../style/card.scss';

.text-style {
  color: #00DEA4;
}
</style>
