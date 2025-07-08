<template>
  <div class="content">
    <div class="content-porperty">{{ $t('device.slave_id') }}</div>
    <n-input-number v-model:value="data.property.slaveid" :min="1" :max="254" :disabled="isEdit" />
    <div class="content-porperty">{{ $t('device.connection') }}</div>
    <n-select
      v-model:value="data.property.connectionOption"
      :options="connectionOptions"
      disabled
    />
    <div class="content-porperty">{{ $t('device.serial_settings') }}</div>
    <n-select v-model:value="data.property.port" :options="serialOptions" :disabled="isEdit" />
    <n-grid x-gap="24" :cols="2">
      <n-gi>
        <div class="content-porperty">{{ $t('device.baud') }}</div>
        <n-select
          v-model:value="data.property.baudrate"
          :options="baudOptions"
          :disabled="isEdit"
        />
        <div class="content-porperty">{{ $t('device.stop_bits') }}</div>
        <n-select
          v-model:value="data.property.stopbits"
          :options="stopbitOptions"
          :disabled="isEdit"
        />
      </n-gi>
      <n-gi>
        <div class="content-porperty">{{ $t('device.data_bits') }}</div>
        <n-select
          v-model:value="data.property.bytesize"
          placeholder="Select"
          :options="databitOptions"
          :disabled="isEdit"
        />
        <div class="content-porperty">{{ $t('device.parity') }}</div>
        <n-select
          v-model:value="data.property.parity"
          :options="parityOptions"
          :disabled="isEdit"
        />
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
import { watch, onMounted, ref } from 'vue'
import { readSerialValue } from '@/api/http'

const t = window['$t']

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

const serialOptions = ref([])

onMounted(() => {
  fetchSerialOptions()
})

const fetchSerialOptions = async () => {
  try {
    const res: any = await readSerialValue()

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      return
    }

    serialOptions.value = res.data.map((v: any) => ({
      label: v,
      value: v
    }))

  } catch (error) {
    console.error('Error fetching serial options:', error)
  }
}

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
