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

      <div v-for="(val, key, index) in data" :key="key" style="margin-top: 12px">
        <span class="modal-porperty">{{ KNX_ID_MAP(String(key)) }}</span>
        <div
          v-if="
            key === 'name' ||
            key === 'description' ||
            key === 'read_address' ||
            key === 'write_address' ||
            key === 'tags'
          "
          class="modal-editstyle"
        >
          <div v-if="isEdit">
            <div v-if="!editStates[key]" class="modal-editvalue">
              <span>{{ val }}</span>
              <n-icon size="20" class="go-cursor-pointer" @click="() => enterEditMode(key)">
                <EditIcon />
              </n-icon>
            </div>
            <div v-else class="modal-editvalue">
              <n-input v-model:value="tempValues[key]" type="text" :style="{ width: '600px' }" />
              <n-icon size="20" class="go-cursor-pointer" @click="() => handleSave(key)">
                <CheckmarkIcon />
              </n-icon>
              <n-icon size="20" class="go-cursor-pointer" @click="() => cancelEdit(key)">
                <CloseIcon />
              </n-icon>
            </div>
          </div>
          <div v-else>
            <n-input v-model:value="data[key]" type="text" />
          </div>
        </div>
        <div v-else-if="key === 'value_type'" class="modal-editstyle">
          <div v-if="isEdit">
            <div v-if="!editStates[key]" class="modal-editvalue">
              <span>{{ valueTypeTrans(val) }}</span>
              <n-icon size="20" class="go-cursor-pointer" @click="() => enterEditMode(key)">
                <EditIcon />
              </n-icon>
            </div>
            <div v-else class="modal-editvalue">
              <n-select v-model:value="tempValues[key]" :options="KNXValueTypeOptions" />
              <n-icon size="20" class="go-cursor-pointer" @click="() => handleSave(key)">
                <CheckmarkIcon />
              </n-icon>
              <n-icon size="20" class="go-cursor-pointer" @click="() => cancelEdit(key)">
                <CloseIcon />
              </n-icon>
            </div>
          </div>
          <div v-else>
            <n-select v-model:value="data[key]" :options="KNXValueTypeOptions" />
          </div>
        </div>
      </div>
      <div v-if="isEdit">
        <div class="modal-porperty">{{ $t('device.value') }}</div>
        <div v-if="!editStates['vvalue']" class="modal-editvalue modal-editstyle">
          <span>{{ value }}</span>
          <n-icon size="20" class="go-cursor-pointer" @click="() => enterEditMode('vvalue')">
            <EditIcon />
          </n-icon>
        </div>
        <div v-else class="modal-editvalue modal-editstyle">
          <n-input-number
            v-if="data.value_type === 'percent'"
            v-model:value="tempValues['vvalue']"
            :min="0"
            :max="100"
            style="width: 100%"
          />
          <n-select v-else v-model:value="tempValues['vvalue']" :options="BooleanOption" />
          <n-icon size="20" class="go-cursor-pointer" @click="() => handleSave('vvalue')">
            <CheckmarkIcon />
          </n-icon>
          <n-icon size="20" class="go-cursor-pointer" @click="() => cancelEdit('vvalue')">
            <CloseIcon />
          </n-icon>
        </div>
      </div>
      <template v-if="!isEdit" #footer>
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
import { ref, inject, watch, computed, reactive } from 'vue'
import SVG_ICON from '@/svg/SVG_ICON'
import { KNX_ID_MAP } from '../../utils/propertyMap'
import { icon } from '@/plugins'
import { cloneDeep } from 'lodash-es'
import { createModbusPoint, updateIotPoints, readIotPoints } from '@/api/http'
import { KNXValueTypeOptions } from '../../utils/utils'

const t = window['$t']

const { EditIcon } = icon.carbon
const { CloseIcon, CheckmarkIcon } = icon.ionicons5

interface EditState {
  [key: string]: boolean
}

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

const data = ref<{
  name: string
  description: string
  read_address: string
  write_address: string
  value_type: string
  tags: string
  [key: string]: any
}>({
  name: '',
  description: '',
  read_address: '0/1/1',
  write_address: '0/0/1',
  value_type: 'bool',
  tags: ''
})

const editStates = reactive<EditState>({})
const tempValues = reactive<Record<string, any>>({})

const enterEditMode = (key: any) => {
  editStates[key] = true

  if (key === 'vvalue') {
    tempValues[key] = cloneDeep(value.value)
  } else {
    tempValues[key] = cloneDeep(data.value[key])
  }
}

const value = ref<any>()

const handleSave = async (key: any) => {
  if (key === 'vvalue') {
    writeValue(key)
  } else {
    handleSaveCommon(key)
  }
}

const writeValue = async (key: any) => {
  if (tempValues[key] === '' || tempValues[key] === null || tempValues[key] === undefined) {
    window['$message'].error(t('device.msg_value_error'))
    return
  }

  //console.log('Writing value:', tempValues[key])
  try {
    const res: any = await readIotPoints(props.deviceData.key, {
      function: 'write',
      parms: {
        address: data.value.write_address,
        value_type: data.value.value_type,
        value: tempValues[key]
      }
    })

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.data)
      window['$message'].warning(res.data)
      return
    }

    value.value = tempValues[key]
    editStates[key] = false
  } catch (e) {
    console.error('onSubmit:', e)
  }
}

const handleSaveCommon = async (key: any) => {
  let load = {}

  if (
    (key === 'name' && tempValues[key] === '') ||
    (key === 'read_address' && tempValues[key] === '') ||
    (key === 'write_address' && tempValues[key] === '')
  ) {
    window['$message'].warning(t('device.msg_enter_params'))
    return
  }

  if (['name', 'description', 'tags'].includes(key)) {
    load = { [key]: tempValues[key] }
  } else if (['read_address', 'write_address', 'value_type'].includes(key)) {
    load = {
      property: {
        read_address: key === 'read_address' ? tempValues[key] : data.value.read_address,
        write_address: key === 'write_address' ? tempValues[key] : data.value.write_address,
        value_type: key === 'value_type' ? tempValues[key] : data.value.value_type
      }
    }
  }

  //console.log('Saving data:', key, load)
  try {
    const res: any = await updateIotPoints(props.editData.key, load)

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      window['$message'].warning(res.data)
      return
    }

    window['$message'].success(t('device.msg_mod_success'))

    data.value[key] = tempValues[key]
    editStates[key] = false
  } catch (error) {
    console.error('Error saving value:', error)
  }
}

const cancelEdit = (key: any) => {
  editStates[key] = false
}

const onSubmit = async () => {
  if (!props.isEdit) {
    if (!dataCheck(data.value)) {
      addNewPoint()
    }
  }
}

const dataCheck = (data: any) => {
  let flag = false

  //console.log(data)
  if (data.name === '' || data.read_address === '' || data.write_address === '') {
    window['$message'].warning(t('device.msg_enter_params'))
    return true
  }

  return flag
}

const addNewPoint = async () => {
  loading.value = true

  try {
    const res: any = await createModbusPoint({
      uid: data.value.name,
      name: data.value.name,
      property: {
        read_address: data.value.read_address,
        write_address: data.value.write_address,
        value_type: data.value.value_type
      },
      tags: data.value.tags,
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

const onClose = () => {
  emit('update:isShowModal', false)
}

const valueTypeTrans = (value: any) => {
  const Options = [
    {
      label: t('device.bool'),
      value: 'bool'
    },
    {
      label: t('device.percent'),
      value: 'percent'
    }
  ]

  const option = Options.find(opt => opt.value === value)
  return option?.label || value // 严格遵循找不到返回空字符串
}

const BooleanOption = [
  { label: 'True', value: 1 },
  { label: 'False', value: 0 }
]

watch(
  () => props.isEdit,
  newVal => {
    if (newVal) {
      data.value = {
        name: props.editData.metric_name,
        description: props.editData.description,
        read_address: props.editData.properties.read_address,
        write_address: props.editData.properties.write_address,
        value_type: props.editData.properties.value_type,
        tags: props.editData.tags
      }

      if (props.editData.value) {
        value.value = props.editData.value
      }

      //console.log('asda', props.editData)
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

  &-editstyle {
    border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  }

  &-editvalue {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 34px;
  }
}

::v-deep(.n-input-wrapper) {
  background-color: #{$--color-dark-modal-content};
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
