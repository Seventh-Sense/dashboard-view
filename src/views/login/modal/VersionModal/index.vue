<template>
  <n-modal :show="showModal">
    <n-card
      :bordered="true"
      role="dialog"
      aria-modal="true"
      size="small"
      :mask-closable="false"
      class="modal"
    >
      <template #header>
        <n-space justify="space-between" align="center">
          <span class="modal-title">
            {{ $t('login.about_us') }}
          </span>
          <n-icon size="32" :depth="1" @click="onClose" style="cursor: pointer">
            <CloseOutlineIcon />
          </n-icon>
        </n-space>
      </template>
      <div class="modal-content">
        <img width="120" height="120" :src="SVG_ICON.card_icons.logo" />
        <div class="modal-content-title">XPlay by LUBANX</div>
        <div class="modal-content-tip">Version 123.456.7.8</div>
      </div>
      <template #footer>
        <div class="modal-content-foot">XPlay © 2024 Adveco Technology Co., Ltd. All rights reserved.</div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { icon } from '@/plugins'
import SVG_ICON from '@/svg/SVG_ICON'

const { CloseOutlineIcon } = icon.ionicons5

let emit = defineEmits(['update:showModal'])
const props = defineProps({
  showModal: {
    type: Boolean,
    required: true
  }
})

const onClose = () => {
  emit('update:showModal', false)
}
</script>

<style lang="scss" scoped>
.modal {
  width: 480px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(50px);
  border-radius: 18px;

  &-title {
    font-size: 20px;
    color: #{$--color-dark-font};
    font-style: normal;
    text-transform: none;
    font-weight: bold;
  }

  &-content {
    height: 270px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 24px;

    &-title {
      font-size: 24px;
      color: rgba(255, 255, 255, 0.93);
      font-weight: 400;
    }

    &-tip {
      font-size: 24px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 400;
    }

    &-foot {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.60);
        font-weight: 400;
    }
  }
}
</style>
