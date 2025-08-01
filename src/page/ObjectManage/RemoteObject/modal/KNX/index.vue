<template>
  <div class="content">
    <div class="content-porperty">{{ $t('device.address_format') }}</div>
    <n-select v-model:value="data.property.address_format" :options="addrFormatOptions" :disabled="isEdit" />
    <div class="content-porperty">{{ $t('device.connection_type') }}</div>
    <n-select v-model:value="data.property.connection_type" :options="connectTypeOptions" :disabled="isEdit" />
    <div class="content-porperty">{{ $t('device.gateway_ip') }}</div>
    <n-input v-model:value="data.property.gateway_ip" :disabled="isEdit" />
    <div class="content-porperty">{{ $t('device.gateway_port') }}</div>
    <n-input-number v-model:value="data.property.gateway_port" :min="0" :disabled="isEdit" />
  </div>
</template>

<script setup lang="ts">
import { connectTypeOptions, addrFormatOptions } from '../../utils/utils';
import { watch } from 'vue';

const props = defineProps({
  isEdit: {
    type: Boolean,
    required: false
  },
  data: {
    type: Object,
    required: true
  }
})

const t = window['$t']

watch(
  () => props.data,
  newData => {
    //console.log('Data changed:', newData)
  },
  { deep: true, immediate: true }
)
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
