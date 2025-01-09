<template>
  <div class="content">
    <div class="content-porperty">{{ $t('device.connection') }}</div>
    <n-select v-model:value="data.connectionOption" :options="connectionOptions" disabled/>
    <div class="content-porperty">{{ $t('device.serial_settings') }}</div>
    <n-select v-model:value="data.stop_bit" :options="stopbitOptions" />
    <n-grid x-gap="24" :cols="2">
      <n-gi>
        <div class="content-porperty">{{ $t('device.baud') }}</div>
        <n-select v-model:value="data.baudrate" :options="baudOptions" />
        <div class="content-porperty">{{ $t('device.stop_bits') }}</div>
        <n-select v-model:value="data.stop_bit" :options="stopbitOptions" />
      </n-gi>
      <n-gi>
        <div class="content-porperty">{{ $t('device.data_bits') }}</div>
        <n-select v-model:value="data.data_bit" placeholder="Select" :options="databitOptions" />
        <div class="content-porperty">{{ $t('device.parity') }}</div>
        <n-select v-model:value="data.parity" :options="parityOptions" />
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import {
  baudOptions,
  databitOptions,
  parityOptions,
  stopbitOptions,
  connectionOptions
} from '../../utils/utils'

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
  margin-bottom: 32px;

  &-porperty {
    font-size: 12px;
    color: #{$--color-dark-modal-title};
    font-style: normal;
    font-weight: 400;
    margin-top: 22px;
  }
}
</style>
