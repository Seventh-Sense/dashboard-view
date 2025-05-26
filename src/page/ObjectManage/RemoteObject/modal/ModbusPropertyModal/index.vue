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
            {{ $t('device.add_point') }}
          </span>
          <img
            style="cursor: pointer"
            @click="onClose"
            width="24"
            height="24"
            :src="SVG_ICON.card_icons.dismiss"
          />
        </n-space>
      </template>

      <div class="modal-porperty" style="margin-top: 7px">{{ $t('device.name') }}</div>
      <n-input v-model:value="data.name" type="text" :disabled="isEdit" />

      <div class="modal-porperty">{{ $t('device.desc') }}</div>
      <n-input v-model:value="data.description" type="text" :disabled="isEdit" />

      <div class="modal-porperty">{{ $t('device.reg_type') }}</div>
      <n-select v-model:value="data.function" :options="functionOptions" :disabled="isEdit" />

      <div class="modal-porperty">{{ $t('device.reg_attr') }}</div>
      <n-input-number v-model:value="data.address" :min="0" :disabled="isEdit" />

      <div class="modal-porperty">{{ $t('device.reg_num') }}</div>
      <n-input-number v-model:value="data.count" :min="0" :disabled="isEdit" />

      <div class="modal-porperty">{{ $t('device.data_type') }}</div>
      <n-select v-model:value="data.data_type" :options="DatatypeOptions" :disabled="isEdit" />

      <div class="modal-porperty">{{ $t('device.byte_order') }}</div>
      <n-select v-model:value="data.byteorder" :options="OrderOptions" :disabled="isEdit" />

      <div class="modal-porperty">{{ $t('device.word_order') }}</div>
      <n-select v-model:value="data.wordorder" :options="OrderOptions" :disabled="isEdit" />

      <div class="modal-porperty">{{ $t('device.coefficient') }}</div>
      <n-input-number
        v-model:value="data.divisor"
        :min="0"
        style="margin-bottom: 10px"
        :disabled="isEdit"
      />
      <div v-if="isWriteble">
        <div class="modal-porperty">{{ $t('device.value') }}</div>
        <n-input-number v-model:value="value" :min="0" style="margin-bottom: 10px" />
      </div>

      <template #footer>
        <n-space justify="end">
          <div class="modal-button-close" @click="onClose">{{ $t('global.r_cancel') }}</div>
          <n-button class="modal-button-ok" :loading="loading" @click="onSubmit">
            {{ $t('global.r_ok') }}
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import SVG_ICON from '@/svg/SVG_ICON'
import { ref, inject, watch, computed } from 'vue'
import { functionOptions, OrderOptions, DatatypeOptions } from '../../utils/utils'
import { createModbusPoint, readIotPoints } from '@/api/http'

const t = window['$t']

const refreshObjTable: any = inject('refreshObjTable')
let emit = defineEmits(['update:isShowModal'])
const props = defineProps({
  isShowModal: {
    type: Boolean,
    required: true
  },
  isEdit: {
    type: Boolean,
    required: true
  },
  deviceData: {
    type: Object,
    required: true
  },
  editData: {
    type: Object,
    required: true
  }
})

const loading = ref(false)

const data = ref({
  name: 'New Point',
  description: '',
  function: '03',
  address: 0,
  count: 1,
  data_type: 'int16',
  byteorder: 1,
  wordorder: 1,
  divisor: 1
})

const value = ref()

//01 03 可写值 02 04 不可写
const isWriteble = computed(() => {
  let flag = false

  if (props.isEdit) {
    if (data.value.function === '01' || data.value.function === '03') {
      flag = true
    }
  }

  return flag
})

const onSubmit = async () => {
  if (!props.isEdit) {
    addNewPoint()
  } else {
    writeValue()
  }
}

const addNewPoint = async () => {
  loading.value = true
  try {
    const res: any = await createModbusPoint({
      uid: data.value.address,
      name: data.value.name,
      property: {
        function: data.value.function,
        parms: {
          address: data.value.address,
          count: data.value.count,
          data_type: data.value.data_type,
          byteorder: data.value.byteorder,
          wordorder: data.value.wordorder,
          divisor: data.value.divisor
        }
      },
      tags: '',
      description: data.value.description,
      device_id: props.deviceData.key
    })

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      window['$message'].warning(t('device.msg_del_fail') + res.status)
      return
    }
  } catch (e) {
    console.error('onSubmit:', e)
  } finally {
    refreshObjTable()
    loading.value = false
    emit('update:isShowModal', false)
  }
}

const writeValue = async () => {
  loading.value = true
  const func = data.value.function === '03' ? '06' : '05'

  if (value.value === '' || value.value === null || value.value === undefined) {
    window['$message'].error(t('device.msg_value_error'))
    return
  }

  try {
    const res: any = await readIotPoints(props.deviceData.key, {
      function: func,
      parms: {
        address: data.value.address,
        value: value.value,
        data_type: data.value.data_type,
        byteorder: data.value.byteorder,
        wordorder: data.value.wordorder,
        divisor: data.value.divisor
      }
    })

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.data)
      window['$message'].warning(res.data)
      return
    }
  } catch (e) {
    console.error('onSubmit:', e)
  } finally {
    refreshObjTable()
    loading.value = false
    emit('update:isShowModal', false)
  }
}

const onClose = () => {
  emit('update:isShowModal', false)
}

watch(
  () => props.isEdit,
  newVal => {
    console.log(props.editData)
    if (newVal) {
      data.value = {
        name: props.editData.metric_name,
        description: props.editData.description,
        function: props.editData.properties.function,
        address: props.editData.properties.parms.address,
        count: props.editData.properties.parms.count,
        data_type: props.editData.properties.parms.data_type,
        byteorder: props.editData.properties.parms.byteorder,
        wordorder: props.editData.properties.parms.wordorder,
        divisor: props.editData.properties.parms.divisor
      }
      value.value = parseFloat(props.editData.value)
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.modal {
  width: 640px;
  background: #{$--color-dark-modal-content};
  backdrop-filter: blur(50px);
  border-radius: 18px;

  &-porperty {
    font-size: 12px;
    color: #{$--color-dark-modal-title};
    font-style: normal;
    font-weight: 400;
    margin-top: 20px;
  }

  &-button-close {
    width: 72px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #{$--color-dark-border};
    border-radius: 2px;
    background-color: #{$--color-dark-card-image};
    cursor: pointer;
  }

  &-button-ok {
    width: 72px;
    height: 32px;
    border: 0;
    border-radius: 2px;
  }
}

::v-deep(.n-input-wrapper) {
  background-color: #{$--color-dark-modal-content};
}

::v-deep(.n-input__input-el) {
  border-bottom: 1px solid #{$--color-dark-modal-title};
}

::v-deep(.n-select) {
  border-bottom: 1px solid #{$--color-dark-modal-title};
}

::v-deep(.n-base-selection) {
  --n-border: 0 !important;
  --n-border-active: 0 !important;
  --n-border-hover: 0 !important;
  --n-border-focus: 0 !important;
  --n-box-shadow-active: 0 !important;
  --n-box-shadow-focus: 0 !important;
  --n-color-active: #{$--color-dark-modal-content} !important;
  --n-color-disabled: #{$--color-dark-modal-content} !important;
  --n-padding-single: 0 26px 0 0 !important;
}

::v-deep(.n-base-selection-label) {
  background-color: #{$--color-dark-modal-content};
}
</style>
