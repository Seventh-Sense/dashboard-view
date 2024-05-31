<template>
  <div class="card-outer">
    <div class="left-style">
      <span v-if="msg_num <= 10" class="right-text" style="color: #00DEA4;">{{ msg_num }}</span>
      <span v-else-if="msg_num <= 20 && msg_num > 10" class="right-text" style="color: #FFC324;">{{ msg_num }}</span>
      <span v-else-if="msg_num > 20" class="right-text" style="color: #FC5185;">{{ msg_num }}</span>
      <span class="right-down">通知信息</span>
      <span class="watch-style">查看</span>
    </div>
    <div>
        <img width="96" height="96" :src="SVG_ICON.card_icons.red_alarm"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import SVG_ICON from '@/svg/SVG_ICON'
import {ref} from "vue";

const msg_num = ref(70);
</script>

<style lang="scss" scoped>
@import '../../../style/card.scss';

.watch-style {
  font-size: 12px;
  font-weight: 400;
  color: #A0ACAE;
  line-height: 15px;
  margin-top: 12px;
  cursor: pointer;
}
</style>
