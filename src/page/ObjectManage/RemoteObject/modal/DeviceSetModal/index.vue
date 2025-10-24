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
        <n-input
          v-model:value="data.name"
          type="text"
          :disabled="isEdit"
          :placeholder="t('device.msg_enter_name')"
        />
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
import { ref, watch, shallowRef, inject, onMounted } from 'vue'
import {
  DataType,
  ModbusRTUData,
  ModbusTCPData,
  KNXData,
  TypeOptions,
  pollOptions,
  isEmptyObject,
  DeviceTypeEnum,
  OPCUAData
} from '../../utils/utils'
import { loadAsyncComponent, validateIPv4 } from '@/utils'
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
const KNX = loadAsyncComponent(() => import('../KNX/index.vue'))
const OPCUA = loadAsyncComponent(() => import('../OPCUA/index.vue'))

const data = ref<DataType>({
  id: '',
  name: '',
  type: DeviceTypeEnum.BACnet,
  polling: 3,
  enabled: true,
  address: 1,
  property: {}
})

// 提交处理
const onSubmit = async () => {
  switch (data.value.type) {
    case DeviceTypeEnum.BACnet:
      onClose()
      break

    case DeviceTypeEnum.ModbusRTU:
    case DeviceTypeEnum.ModbusTCP:
    case DeviceTypeEnum.KNX:
    case DeviceTypeEnum.OPCUA:
      if (props.isEdit) {
        handleEditClose()
      } else if (!dataCheck(data.value)) {
        await handleSubmitByType(data.value)
      }
      break

    default:
      break
  }
}

// 根据设备类型处理提交
const handleSubmitByType = async (deviceData: DataType) => {
  try {
    let params

    switch (deviceData.type) {
      case DeviceTypeEnum.ModbusTCP:
        params = createModbusTCPParams(deviceData)
        break
      case DeviceTypeEnum.ModbusRTU:
        params = createModbusRTUParams(deviceData)
        break
      case DeviceTypeEnum.KNX:
        params = createKNXParams(deviceData)
        break
      case DeviceTypeEnum.OPCUA:
        params = createOPCUAParams(deviceData)
        break
      default:
        console.log('Submitting params:', deviceData)
        return
    }

    const res: any = await addDevice(params)

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.data)
      window['$message'].warning(res.status)
      return
    }

    onClose()
  } catch (error) {
    console.error(`Error handling ${deviceData.type}:`, error)
    window['$message'].error(t('msg.msg_error_2'))
  }
}

// 参数创建函数
const createModbusTCPParams = (data: DataType) => ({
  uid: `ModbusTCP,${data.property.host}:${data.property.port}`,
  name: data.name,
  address: data.address.toString(),
  protocol: DeviceTypeEnum.ModbusTCP,
  enabled: true,
  status: '',
  description: '',
  property: {
    host: data.property.host,
    port: data.property.port,
    connectionOption: data.property.connectionOption
  },
  tags: ''
})

const createModbusRTUParams = (data: DataType) => ({
  uid: `ModbusRTU,${data.property.slaveid}`,
  name: data.name,
  address: data.property.slaveid.toString(),
  protocol: DeviceTypeEnum.ModbusRTU,
  enabled: true,
  status: '',
  description: '',
  property: {
    slaveid: data.property.slaveid,
    port: data.property.port,
    baudrate: data.property.baudrate,
    bytesize: data.property.bytesize,
    stopbits: data.property.stopbits,
    parity: data.property.parity,
    connectionOption: data.property.connectionOption
  },
  tags: ''
})

const createKNXParams = (data: DataType) => ({
  uid: `KNX,${data.property.gateway_ip}:${data.property.gateway_port}`,
  name: data.name,
  address: data.property.gateway_ip,
  protocol: DeviceTypeEnum.KNX,
  enabled: true,
  status: '',
  description: '',
  property: {
    address_format: data.property.address_format,
    connection_type: data.property.connection_type,
    gateway_ip: data.property.gateway_ip,
    gateway_port: data.property.gateway_port
  },
  tags: ''
})

const createOPCUAParams = (data: DataType) => {
  // 解析主机地址
  const parseHostFromUrl = (url: string): string | undefined => {
    const [protocol, address] = url.split('://')
    if (!address) return undefined

    const [host] = address.split(':')
    return host
  }

  // 提取认证信息
  const {
    auth_mode,
    username,
    password,
    user_cert,
    user_key,
    cert_url,
    user_cert_name,
    user_key_name
  } = data.property
  //const isUserAuth = auth_mode === 1
  //const isCertAuth = auth_mode === 2

  return {
    uid: `OPCUA,${data.property.url}`,
    name: data.name,
    address: parseHostFromUrl(data.property.url),
    protocol: DeviceTypeEnum.OPCUA,
    enabled: true,
    status: '',
    description: '',
    property: {
      url: data.property.url,
      security_policy: data.property.security_policy,
      security_mode: data.property.security_mode,
      username: username,
      password: password,
      user_cert_name: user_cert_name,
      user_key_name: user_key_name,
      user_cert: user_cert === '' ? null : user_cert,
      user_key: user_key === '' ? null : user_key,
      cert_url: cert_url,
      auth_mode: data.property.auth_mode
    },
    tags: ''
  }
}

// 关闭处理
const onClose = () => {
  resetForm()
  refreshFunc?.()
  emit('update:isShowModal', false)
}

// 编辑模式关闭处理
const handleEditClose = () => {
  resetForm()
  emit('update:isShowModal', false)
}

// 重置表单
const resetForm = () => {
  content.value = null
  data.value = {
    id: '',
    name: '',
    type: DeviceTypeEnum.BACnet,
    polling: 3,
    enabled: true,
    address: 1,
    property: {}
  }
}

// 数据校验
const dataCheck = (deviceData: DataType): boolean => {
  console.log('Validating device data:', deviceData)
  switch (deviceData.type) {
    case DeviceTypeEnum.ModbusTCP:
      return validateModbusTCP(deviceData)
    case DeviceTypeEnum.ModbusRTU:
      return validateModbusRTU(deviceData)
    case DeviceTypeEnum.KNX:
      return validateKNX(deviceData)
    case DeviceTypeEnum.OPCUA:
      return validateOPCUA(deviceData)
    default:
      return false
  }
}

// 各类型数据校验
const validateModbusTCP = (data: DataType): boolean => {
  if (!data.name || !data.property.host || data.property.port === null || data.address === null) {
    window['$message'].error(t('device.msg_enter_params'))
    return true
  }

  if (!validateIPv4(data.property.host)) {
    window['$message'].error(t('msg.msg_error_5'))
    return true
  }

  return false
}

const validateModbusRTU = (data: DataType): boolean => {
  if (!data.name || !data.property.port || data.property.slaveid === null) {
    window['$message'].error(t('device.msg_enter_params'))
    return true
  }
  return false
}

const validateKNX = (data: DataType): boolean => {
  if (!data.name || data.property.gateway_port === null) {
    window['$message'].error(t('device.msg_enter_params'))
    return true
  }

  if (!validateIPv4(data.property.gateway_ip)) {
    window['$message'].error(t('msg.msg_error_5'))
    return true
  }

  return false
}

const validateOPCUA = (data: DataType): boolean => {
  if (
    !data.name ||
    !data.property.url ||
    !data.property.security_policy ||
    !data.property.security_mode
  ) {
    window['$message'].error(t('device.msg_enter_params'))
    return true
  }

  // OPC UA URL格式校验
  // 正则表达式解释：
  // ^opc\.tcp:// - 必须以opc.tcp://开头
  // (\d{1,3}\.){3}\d{1,3} - 匹配IP地址（如192.168.0.3）
  // :\d{1,5}$ - 匹配端口号（1-5位数字）
  const urlPattern = /^opc\.tcp:\/\/(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/
  if (!urlPattern.test(data.property.url)) {
    window['$message'].error(t('msg.msg_error_5'))
    return true
  }

  // 额外的IP地址范围校验（可选）
  // 确保每个IP段的值在0-255之间
  const ipPart = data.property.url.split('://')[1]?.split(':')[0]
  if (ipPart) {
    const ipSegments = ipPart.split('.')
    const isValidIp = ipSegments.every((segment: any) => {
      const num = parseInt(segment, 10)
      return !isNaN(num) && num >= 0 && num <= 255
    })

    if (!isValidIp) {
      window['$message'].error(t('msg.msg_error_5'))
      return true
    }
  }

  // 额外的端口范围校验（可选）
  // 确保端口号在1-65535之间
  const portPart = data.property.url.split(':').pop()
  if (portPart) {
    const port = parseInt(portPart, 10)
    if (isNaN(port) || port < 1 || port > 65535) {
      window['$message'].error(t('msg.msg_error_5'))
      return true
    }
  }

  return false
}

// 插入对应类型的内容组件
const insertContent = (type: DeviceTypeEnum, edit: boolean) => {
  switch (type) {
    case DeviceTypeEnum.BACnet:
      content.value = BACnet
      data.value.property = {}
      break
    case DeviceTypeEnum.ModbusRTU:
      content.value = ModbusRTU
      if (!edit) data.value.property = cloneDeep(ModbusRTUData)
      break
    case DeviceTypeEnum.ModbusTCP:
      content.value = ModbusTCP
      if (!edit) data.value.property = cloneDeep(ModbusTCPData)
      break
    case DeviceTypeEnum.KNX:
      content.value = KNX
      if (!edit) data.value.property = cloneDeep(KNXData)
      break
    case DeviceTypeEnum.OPCUA:
      content.value = OPCUA
      data.value.property = cloneDeep(OPCUAData)
      break
    default:
      content.value = null
      data.value.property = {}
  }
}

// 监听设备类型变化
watch(
  () => data.value.type,
  newValue => {
    if (!props.isEdit) {
      insertContent(newValue as DeviceTypeEnum, false)
    }
  },
  { immediate: false }
)

// 监听模态框显示状态
watch(
  () => props.isShowModal,
  isVisible => {
    if (isVisible) {
      if (props.isEdit) {
        insertContent(props.deviceData.device_type, true)
        data.value = {
          id: '',
          name: props.deviceData.device_name,
          type: props.deviceData.device_type,
          polling: 3,
          enabled: true,
          address:
            props.deviceData.device_type === DeviceTypeEnum.KNX ||
            props.deviceData.device_type === DeviceTypeEnum.OPCUA
              ? props.deviceData.address
              : Number(props.deviceData.address),
          property: props.deviceData.properties
        }
      } else {
        insertContent(DeviceTypeEnum.BACnet, false)
      }
    }
  },
  { immediate: true }
)

// 初始化
onMounted(() => {
  if (props.isShowModal) {
    insertContent(props.isEdit ? props.deviceData.device_type : DeviceTypeEnum.BACnet, props.isEdit)
  }
})
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
