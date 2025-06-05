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
            {{ $t('device.add_device') }}
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

      <div v-if="data.type !== DeviceTypeEnum.BACnet">
        <div class="modal-porperty" style="margin-top: 7px">{{ $t('device.name') }}</div>
        <n-input v-model:value="data.name" type="text" :disabled="isEdit" />
      </div>

      <n-grid x-gap="12" :cols="4">
        <n-gi span="2">
          <div class="modal-porperty">{{ $t('device.type') }}</div>
          <n-select
            v-model:value="data.type"
            placeholder="Select"
            :options="TypeOptions"
            :disabled="isEdit"
          />
        </n-gi>
        <n-gi span="1">
          <div class="modal-porperty">{{ $t('device.polling') }}</div>
          <n-select
            v-model:value="data.polling"
            placeholder="Select"
            :options="pollOptions"
            disabled
          />
        </n-gi>
      </n-grid>

      <component :is="content" :isEdit="isEdit" :data="data"></component>
      <template #footer v-if="data.type !== DeviceTypeEnum.BACnet">
        <n-space justify="end">
          <div class="modal-button-close" @click="onClose">{{ $t('global.r_cancel') }}</div>
          <n-button class="modal-button-ok" @click="onSubmit">{{ $t('global.r_ok') }}</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, watch, shallowRef, inject } from 'vue'
import {
  DataType,
  ModbusRTUData,
  ModbusTCPData,
  TypeOptions,
  pollOptions,
  isEmptyObject,
  DeviceTypeEnum
} from '../../utils/utils'
import { loadAsyncComponent } from '@/utils'
import SVG_ICON from '@/svg/SVG_ICON'
import { addDevice } from '@/api/http'
import { cloneDeep } from 'lodash'

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
  }
})
let emit = defineEmits(['update:isShowModal'])
const refreshFunc: any = inject('refreshFunc')
const t = window['$t']
const content = shallowRef(null)

const BACnet = loadAsyncComponent(() => import('../BACnet/index.vue'))
const ModbusRTU = loadAsyncComponent(() => import('../ModbusRTU/index.vue'))
const ModbusTCP = loadAsyncComponent(() => import('../ModbusTCP/index.vue'))

const data = ref<DataType>({
  id: '',
  name: 'New Object',
  type: DeviceTypeEnum.BACnet,
  polling: 3,
  enabled: true,
  address: 1,
  property: {}
})

const onSubmit = () => {
  //console.log('data', data.value)
  if (data.value.type === DeviceTypeEnum.BACnet) {
    handleBACnet()
  } else if (data.value.type === DeviceTypeEnum.ModbusRTU) {
    if (props.isEdit) {
      //clear
      handleBACnet()
    } else {
      //参数校验
      if (dataCheck(data.value)) return

      handleModbusRtu(data.value)
    }
  } else if (data.value.type === DeviceTypeEnum.ModbusTCP) {
    if (props.isEdit) {
      //clear
      handleBACnet()
    } else {
      if (dataCheck(data.value)) return

      handleModbusTCP(data.value)
    }
  }
}

const handleBACnet = () => {
  onClear()
  refreshFunc()
  emit('update:isShowModal', false)
}

const handleModbusTCP = async (load: DataType) => {
  try {
    const res: any = await addDevice({
      uid: 'modbus' + ',' + load.address,
      name: load.name,
      address: load.address.toString(),
      protocol: DeviceTypeEnum.ModbusTCP,
      enabled: true,
      status: '',
      description: '',
      property: {
        host: load.property.host,
        port: load.property.port,
        connectionOption: load.property.connectionOption
      },
      tags: ''
    })

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      window['$message'].warning(res.status)
      return
    }
  } catch (error) {
    console.error('handle ModbusRtu:', error)
  } finally {
    onClear()
    refreshFunc()
    emit('update:isShowModal', false)
  }
}

const handleModbusRtu = async (load: DataType) => {
  try {
    const res: any = await addDevice({
      uid: 'modbus' + ',' + load.property.slaveid,
      name: load.name,
      address: load.property.slaveid.toString(),
      protocol: DeviceTypeEnum.ModbusRTU,
      enabled: true,
      status: '',
      description: '',
      property: {
        slaveid: load.property.slaveid,
        port: load.property.port,
        baudrate: load.property.baudrate,
        bytesize: load.property.bytesize,
        stopbits: load.property.stopbits,
        parity: load.property.parity,
        connectionOption: load.property.connectionOption
      },
      tags: ''
    })

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      window['$message'].warning(res.status)
      return
    }

    console.log('ModbusRtu info', res)
  } catch (error) {
    console.error('handle ModbusRtu:', error)
  } finally {
    onClear()
    refreshFunc()
    emit('update:isShowModal', false)
  }
}

const onClose = () => {
  onClear()
  refreshFunc()
  emit('update:isShowModal', false)
}

//clear
const onClear = () => {
  content.value = null
  data.value = {
    id: '',
    name: 'New Object',
    type: DeviceTypeEnum.BACnet,
    polling: 3,
    enabled: true,
    address: 1,
    property: {}
  }
}

const dataCheck = (load: DataType) => {
  let flag = false

  if (load.type === DeviceTypeEnum.ModbusTCP) {
    if (
      load.name === '' ||
      load.property.host === '' ||
      load.property.port === null ||
      load.address === null
    ) {
      window['$message'].error(t('device.msg_enter_params'))
      flag = true
    }
  }

  if (load.type === DeviceTypeEnum.ModbusRTU) {
    if (load.name === '' || load.property.port === '' || load.property.slaveid === null) {
      window['$message'].error(t('device.msg_enter_params'))
      flag = true
    }
  }

  return flag
}

const insertContent = (type: string, edit: boolean) => {
  if (type === DeviceTypeEnum.BACnet) {
    content.value = BACnet

    data.value.property = {}
  } else if (type === DeviceTypeEnum.ModbusRTU) {
    content.value = ModbusRTU

    if (!edit) {
      data.value.property = cloneDeep(ModbusRTUData)
    }
  } else if (type === DeviceTypeEnum.ModbusTCP) {
    content.value = ModbusTCP

    if (!edit) {
      data.value.property = cloneDeep(ModbusTCPData)
    }
  } else {
    content.value = null
    data.value.property = {}
  }
}

watch(
  () => data.value.type,
  newValue => {
    //console.log('data.value.type', data.value.type)
    if (!props.isEdit) {
      insertContent(newValue, false)
    }
  }
)

watch(
  () => props.isShowModal,
  newValue => {
    if (newValue) {
      if (props.isEdit) {
        insertContent(props.deviceData.device_type, true)

        data.value = {
          id: '',
          name: props.deviceData.device_name,
          type: props.deviceData.device_type,
          polling: 3,
          enabled: true,
          address: Number(props.deviceData.address),
          property: props.deviceData.properties
        }
      } else {
        insertContent(DeviceTypeEnum.BACnet, false)
      }
    }
  }
)
</script>

<style lang="scss" scoped>
.modal {
  width: 720px;
  background: #{$--color-dark-modal-content};
  backdrop-filter: blur(50px);
  border-radius: 18px;

  &-title {
    font-size: 20px;
    color: #{$--color-dark-font};
    font-style: normal;
    text-transform: none;
    font-weight: bold;
  }

  &-porperty {
    font-size: 12px;
    color: #{$--color-dark-modal-title};
    font-style: normal;
    font-weight: 400;
    margin-top: 27px;
  }

  &-button-close {
    width: 64px;
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
    width: 64px;
    height: 32px;
    border: 0;
    border-radius: 2px;
  }
}

::v-deep(.n-input) {
  background-color: transparent;
}

::v-deep(.n-input-wrapper) {
  background-color: #{$--color-dark-modal-content};
  border-bottom: 1px solid #{$--color-dark-modal-title};
}

::v-deep(.n-input__input-el) {
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
