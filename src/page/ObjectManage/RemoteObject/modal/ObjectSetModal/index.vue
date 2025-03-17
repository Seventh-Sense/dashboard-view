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
            {{ $t('device.add_device') }}
          </span>
          
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
const props = defineProps({
  isShowModal: {
    type: Boolean,
    required: true
  }
})
</script>

<style lang="scss" scoped></style>
