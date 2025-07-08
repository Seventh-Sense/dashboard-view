<template>
  <div class="content">
    <div class="content-porperty">{{ $t('device.slave_id') }}</div>
    <n-input-number v-model:value="data.address" :min="1" :max="254" :disabled="isEdit" />
    <div class="content-porperty">{{ $t('device.host') }}</div>
    <n-input v-model:value="data.property.host" :disabled="isEdit" />
    <div class="content-porperty">{{ $t('device.port') }}</div>
    <n-input-number v-model:value="data.property.port" :disabled="isEdit" />
    <div class="content-porperty">{{ $t('device.connection') }}</div>
    <n-input v-model:value="data.property.connectionOption" :disabled="true" />
  </div>
</template>

<script setup lang="ts">
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
