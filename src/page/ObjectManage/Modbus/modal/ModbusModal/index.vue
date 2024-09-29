<template>
  <n-modal v-model:show="showModal">
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
            {{ $t('device.config') }}
          </span>
          <n-icon size="32" :depth="1" @click="onNegativeClick" style="cursor: pointer">
            <CloseOutlineIcon />
          </n-icon>
        </n-space>
      </template>
      <n-grid x-gap="24" :cols="2">
        <n-gi>
          <div class="modal-tip" style="margin-top: 0">{{ $t('device.name') }}:</div>
          <n-input v-model:value="data.name" type="text" />

          <div class="modal-tip">{{ $t('device.slave_id') }}:</div>
          <n-input-number
            v-model:value="data.slaveid"
            button-placement="both"
            :show-button="false"
          />
          <div class="modal-tip">{{ $t('device.reg_type') }}:</div>
          <n-select v-model:value="data.reg_type" placeholder="Select" :options="regTypeOptions" />
          <div class="modal-tip">{{ $t('device.coefficient') }}:</div>
          <n-input-number
            v-model:value="data.gain"
            button-placement="both"
            :show-button="false"
            :disabled="!disabled"
          />
          <div class="modal-tip">{{ $t('device.value') }}:</div>
          <n-input v-model:value="data.value" type="text" />
        </n-gi>
        <n-gi>
          <div class="modal-tip" style="margin-top: 0">{{ $t('device.modbus_link') }}:</div>
          <n-select v-model:value="data.modbus_id" placeholder="Select" :options="options" />
          <div class="modal-tip">{{ $t('device.reg_attr') }}:</div>
          <n-input-number v-model:value="data.addr" button-placement="both" :show-button="false" />
          <div class="modal-tip">{{ $t('device.data_type') }}:</div>
          <n-select
            v-model:value="data.data_type"
            placeholder="Select"
            :options="typeOptions"
            :disabled="!disabled"
          />

          <div class="modal-tip">{{ $t('device.coding_seq') }}:</div>
          <n-select
            v-model:value="data.code_seq"
            placeholder="Select"
            :options="codingOptions"
            :disabled="!disabled"
          />

          <div class="modal-tip">{{ $t('device.unit') }}:</div>
          <n-input v-model:value="data.unit" type="text" :disabled="!disabled" />
        </n-gi>
      </n-grid>

      <template #footer>
        <n-space justify="end">
          <n-button @click="onPositiveClick">{{ $t('global.r_ok') }}</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { icon } from '@/plugins'
import { onMounted, ref, watch } from 'vue'
import { regTypeOptions, dataTypeOptions, codingOptions, byteOptions } from '../../utils/utils'
import { updatePoint, writePoint } from '@/api/http'

const { CloseOutlineIcon } = icon.ionicons5

const typeOptions = ref<any[]>([])
const disabled = ref(false)

let emit = defineEmits(['update:showModal'])
const props = defineProps({
  showModal: {
    type: Boolean,
    required: true
  },
  data: {
    type: Object,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  isEdit: {
    type: Boolean,
    required: true
  }
})

const paramCheck = () => {
  let flag = true

  if (props.data.name === '') {
    flag = false
    window['$message'].error('Object name is not filled in!')
  }

  return flag
}
const onPositiveClick = () => {
  if (paramCheck()) {
    if (props.isEdit) {
      updatePoint(props.data.id, props.data)
        .then(res => {
          window['$message'].success('Update Success!')
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          emit('update:showModal', false)
        })
    } else {
      writePoint(props.data)
        .then(res => {
          window['$message'].success('Create Success!')
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          emit('update:showModal', false)
        })
    }
  }
}

const onNegativeClick = () => {
  emit('update:showModal', false)
}

watch(
  () => props.data.reg_type,
  newVal => {
    console.log('adsa', newVal)
    if (newVal === '0' || newVal === '1') {
      typeOptions.value = byteOptions
      props.data.data_type = 'bool'
      disabled.value = false
    } else {
      typeOptions.value = dataTypeOptions
      props.data.data_type = '16int'
      disabled.value = true
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.modal {
  width: 800px;
  background: rgba(0, 0, 0, 1);
  backdrop-filter: blur(50px);
  border-radius: 18px;

  &-title {
    font-size: 20px;
    color: #{$--color-dark-font};
    font-style: normal;
    text-transform: none;
    font-weight: bold;
  }

  &-tip {
    font-size: 12px;
    color: #{$--color-dark-modal-title};
    font-style: normal;
    font-weight: 400;
    margin-top: 22px;
    margin-bottom: 14px;
  }
}
</style>
