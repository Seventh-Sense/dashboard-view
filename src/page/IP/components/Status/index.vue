<template>
  <div class="card-outer">
    <div class="left-style">
      <span v-if="status === '0'" class="right-text" style="color: #00DEA4">激活</span>
      <span v-else-if="status === '1'" class="right-text" style="color: #FC5185">关闭</span>
      <span v-else-if="status === '2'" class="right-text" style="color: #3399FF">应答模式</span>
      <span v-else class="right-text" style="color: #BBBBBB">未激活</span>
    </div>
    <div>
        <img width="96" height="96" :src="SVG_ICON.card_icons.green_alarm"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import SVG_ICON from '@/svg/SVG_ICON'
import {ref} from "vue";

const status = ref('0');
</script>

<style lang="scss" scoped>
@import '../../../style/card.scss';

.text-style {
  color: #00DEA4;
}
</style>
