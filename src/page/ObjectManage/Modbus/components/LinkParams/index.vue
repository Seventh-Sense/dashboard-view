<template>
  <div>
    <n-form
      ref="formRef"
      :model="data"
      label-placement="top"
      label-width="auto"
      require-mark-placement="right-hanging"
      size="small"
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="12" :label="$t('device.connection')" label-align="left">
          <n-select
            v-model:value="data.connect_mode"
            placeholder="Select"
            :options="connectionOptions"
            disabled
          />
        </n-form-item-gi>
        
        <n-form-item-gi :span="12" :label="$t('device.serial_settings')" label-align="left">
          <n-select
            v-model:value="data.serial_port"
            placeholder="Select"
            :options="options"
          />
        </n-form-item-gi>
        
        <n-form-item-gi :span="12" :label="$t('device.baud')" label-align="left">
          <n-select v-model:value="data.baudrate" placeholder="Select" :options="baudOptions" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" :label="$t('device.data_bits')" label-align="left">
          <n-select v-model:value="data.data_bit" placeholder="Select" :options="databitOptions" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" :label="$t('device.parity')" label-align="left">
          <n-select v-model:value="data.parity" placeholder="Select" :options="parityOptions" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" :label="$t('device.stop_bits')" label-align="left">
          <n-select v-model:value="data.stop_bit" placeholder="Select" :options="stopbitOptions" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" :label="$t('device.mode')" label-align="left">
          <n-radio-group v-model:value="data.mode" name="radiogroup1" disabled>
            <n-space>
              <n-radio value="RTU">RTU</n-radio>
              <n-radio value="ASCII">ASCII</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { NFormItemGi } from 'naive-ui'
import {
  connectionOptions,
  baudOptions,
  databitOptions,
  parityOptions,
  stopbitOptions
} from './option'

defineProps({
  data: {
    type: Object,
    required: true
  },
  options: {
    type: Array,
    required: true
  }
})
</script>

<style lang="scss" scoped></style>
