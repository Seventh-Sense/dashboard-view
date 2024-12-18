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
            {{ $t('login.contact_us') }}
          </span>
          <n-icon size="32" :depth="1" @click="onClose" style="cursor: pointer">
            <CloseOutlineIcon />
          </n-icon>
        </n-space>
      </template>
      <div class="modal-content">
        <span style="font-size: 20px;margin-bottom: 24px;">无锡研奇智联技术有限公司</span>
        <span>地址：江苏省无锡市新吴区菱湖大道111号无锡软件园天鹅座B座</span>
      </div>
      
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { icon } from '@/plugins'

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
  width: 512px;
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
    padding-top: 80px;
  }
}
</style>
