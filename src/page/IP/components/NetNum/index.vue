<template>
  <div class="card-outer">
    <div class="left-style">
      <span class="right-text text-style">{{ net_num }}</span>
      <span class="right-down">网络号</span>
    </div>
    <div>
        <img width="96" height="96" :src="SVG_ICON.card_icons.green_alarm"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import SVG_ICON from '@/svg/SVG_ICON'
import {ref} from "vue";

const net_num = ref('1');
</script>

<style lang="scss" scoped>
@import '../../../style/card.scss';

.text-style {
  color: #3399FF;
}
</style>
