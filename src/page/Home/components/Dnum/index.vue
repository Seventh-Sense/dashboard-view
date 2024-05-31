<template>
  <div class="card-outer">
    <div class="left-style">
      <span class="one-style">
        {{onlineNum}}<span class="two-style">/{{ allNum }}</span>
      </span>
      <span class="right-down">设备统计</span>
    </div>
    <div>
        <img width="96" height="96" :src="SVG_ICON.card_icons.yellow_alarm"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SVG_ICON from '@/svg/SVG_ICON'

const onlineNum = ref('999');
const allNum = ref('999');
</script>

<style lang="scss" scoped>
@import '../../../style/card.scss';

.one-style {
  color: #3399FF;
}

.two-style {
  color: var(--theme_text_color);
}
</style>
