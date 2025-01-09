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

      <div class="modal-porperty" style="margin-top: 7px">{{ $t('device.name') }}</div>
      <n-input v-model:value="data.name" type="text" />

      <div class="modal-porperty">{{ $t('device.type') }}</div>
      <n-select v-model:value="data.type" placeholder="Select" :options="TypeOptions" />
      <component :is="content" :data="data.property"></component>
      <template #footer>
        <n-space justify="end">
          <div class="modal-button-close" @click="onClose">{{ $t('global.r_cancel') }}</div>
          <n-button class="modal-button-ok" @click="onSubmit">{{ $t('global.r_ok') }}</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, watch, shallowRef } from 'vue'
import {
  DataType,
  ModbusRTUData,
  BACnetData,
  TypeOptions,
  isBACnet,
  isModbusRTU,
} from '../../utils/utils'
import { loadAsyncComponent } from '@/utils'
import SVG_ICON from '@/svg/SVG_ICON'

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

const content = shallowRef(null)

const BACnet = loadAsyncComponent(() => import('../BACnet/index.vue'))
const ModbusRTU = loadAsyncComponent(() => import('../ModbusRTU/index.vue'))

const data = ref<DataType>({
  id: '',
  name: '',
  type: '',
  enabled: true,
  property: null
})

const onSubmit = () => {
  console.log('data', data.value)
  onClear()
  emit('update:isShowModal', false)
}

const onClose = () => {
  onClear()
  emit('update:isShowModal', false)
}

//clear
const onClear = () => {
  content.value = null
  data.value = { id: '', name: '', type: '', enabled: true, property: null }
}

watch(
  () => data.value.type,
  newValue => {
    if (newValue === 'BACnet') {
      content.value = BACnet

      if (data.value.property === null || !isBACnet(data.value.property)) {
        data.value.property = BACnetData
      }
    } else if (newValue === 'ModbusRTU') {
      content.value = ModbusRTU

      if (data.value.property === null || isModbusRTU(data.value.property)) {
        data.value.property = ModbusRTUData
      }
    } else {
      content.value = null
    }
  }
)

watch(
  () => props.isShowModal,
  newValue => {
    if (newValue && props.isEdit) {
      data.value = {
        id: props.deviceData.id,
        name: props.deviceData.name,
        type: props.deviceData.type,
        enabled: true,
        property: null
      }
    }
  }
)
</script>

<style lang="scss" scoped>
.modal {
  width: 555px;
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
