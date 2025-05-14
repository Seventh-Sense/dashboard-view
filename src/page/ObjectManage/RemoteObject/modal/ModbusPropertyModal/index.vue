<template>
  <n-modal :show="isShowModal">
    <n-card
      :bordered="true"
      role="dialog"
      aria-modal="true"
      size="small"
      :mask-closable="false"
      class="modal"
    ></n-card>
  </n-modal>
</template>

<script setup lang="ts">
const props = defineProps({
  isShowModal: {
    type: Boolean,
    required: true
  },
  deviceData: {
    type: Object,
    required: true
  },
  dataList: {
    type: Array,
    required: true
  }
})
</script>

<style lang="scss" scoped></style>
