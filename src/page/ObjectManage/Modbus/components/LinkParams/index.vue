<template>
  <div>
    <n-form
      ref="formRef"
      :model="data"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
      size="small"
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="12" label="Connection" label-align="left" path="connect_mode">
          <n-select
            v-model:value="data.connect_mode"
            placeholder="Select"
            :options="connectionOptions"
            disabled
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="" path=""></n-form-item-gi>
        <n-form-item-gi :span="12" label="Serial Settings" label-align="left" path="connect_mode">
          <n-select
            v-model:value="data.serial_port"
            placeholder="Select"
            :options="serialOptions"
            disabled
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="" path=""></n-form-item-gi>
        <n-form-item-gi :span="12" label="Baud" label-align="left" path="connect_mode">
          <n-select v-model:value="data.baudrate" placeholder="Select" :options="baudOptions" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Data bits" label-align="left" path="connect_mode">
          <n-select v-model:value="data.data_bit" placeholder="Select" :options="databitOptions" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Parity" label-align="left" path="connect_mode">
          <n-select v-model:value="data.parity" placeholder="Select" :options="parityOptions" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Stop bits" label-align="left" path="connect_mode">
          <n-select v-model:value="data.stop_bit" placeholder="Select" :options="stopbitOptions" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Mode" label-align="left" path="connect_mode">
          <n-radio-group v-model:value="data.mode" name="radiogroup1">
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
  serialOptions,
  baudOptions,
  databitOptions,
  parityOptions,
  stopbitOptions
} from './option'

defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss" scoped></style>
