<template>
  <n-grid class="content" x-gap="24" :cols="2">
    <n-gi>
      <div class="content-porperty">{{ $t('device.data_bits') }}</div>
      <n-input-number
        v-model:value="data.adpuTimeout"
        button-placement="both"
        :show-button="false"
      />
    </n-gi>
    <n-gi>
      <div class="content-porperty">{{ $t('device.stop_bits') }}</div>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.content {
  margin-top: 0;

  &-porperty {
    font-size: 12px;
    color: #{$--color-dark-modal-title};
    font-style: normal;
    font-weight: 400;
    margin-top: 22px;
    margin-bottom: 14px;
  }
}
</style>
