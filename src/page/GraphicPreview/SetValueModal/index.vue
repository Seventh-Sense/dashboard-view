<template>
  <n-modal :show="isShowModal">
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
            {{ $t('device.detail') }}
          </span>
          <img
            style="cursor: pointer"
            @click="onClose"
            width="24"
            height="24"
            :src="SVG_ICON.card_icons.dismiss"
          />
        </n-space>
      </template>
      <div class="modal-content">

      </div>

      <template #footer>
        <n-space justify="end" style="height: 20px">
          <n-button class="modal-button-ok" @click="onSubmit">{{ $t('global.r_ok') }}</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import SVG_ICON from '@/svg/SVG_ICON'

const props = defineProps({
  isShowModal: {
    type: Boolean,
    required: true
  },
  data: {
    type: Object,
    required: true
  }
})

let emit = defineEmits(['update:isShowModal'])

const onSubmit = () => {
  emit('update:isShowModal', false)
}

const onClose = () => {
  emit('update:isShowModal', false)
}
</script>

<style lang="scss" scoped>
.modal {
  height: 300px;
  width: 500px;
}
</style>
