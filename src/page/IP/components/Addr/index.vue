<template>
  <div class="card-outer">
    <div class="left-style">
      <span class="right-text" style="color: #00DEA4;">{{ ipAddr }}</span>
      <span class="right-down">总线地址</span>
    </div>
    <div>
      <!-- <svg-icon icon-class="_green_alarm" className="card-icon-style"/> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import SVG_ICON from '@/svg/SVG_ICON'
import {ref} from "vue";

const ipAddr = ref('10.70.12.168');
</script>

<style lang="scss" scoped>
@import '../../../style/card.scss';
</style>
