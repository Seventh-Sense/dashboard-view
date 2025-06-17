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
        <span class="modal-porperty">{{ MODBUS_ID_MAP(String(key)) }}</span>
        <div
          v-if="key === 'name' || key === 'description' || key === 'address'"
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
            <n-input
              v-model:value="data[key]"
              type="text"
              :placeholder="key === 'address' ? t('device.addr_example') : ''"
            />
          </div>
        </div>
        <div
          v-else-if="
            key === 'function' || key === 'data_type' || key === 'byteorder' || key === 'wordorder'
          "
          class="modal-editstyle"
        >
          <div v-if="isEdit">
            <div v-if="!editStates[key]" class="modal-editvalue">
              <span>{{ modbusSelectTextMap(key, val) }}</span>
              <n-icon size="20" class="go-cursor-pointer" @click="() => enterEditMode(key)">
                <EditIcon />
              </n-icon>
            </div>
            <div v-else class="modal-editvalue">
              <n-select v-model:value="tempValues[key]" :options="modbusSelectOptions(key)" />
              <n-icon size="20" class="go-cursor-pointer" @click="() => handleSave(key)">
                <CheckmarkIcon />
              </n-icon>
              <n-icon size="20" class="go-cursor-pointer" @click="() => cancelEdit(key)">
                <CloseIcon />
              </n-icon>
            </div>
          </div>
          <div v-else>
            <n-select v-model:value="data[key]" :options="modbusSelectOptions(key)" />
          </div>
        </div>
        <div v-else-if="key === 'count' || key === 'divisor'" class="modal-editstyle">
          <div v-if="isEdit">
            <div v-if="!editStates[key]" class="modal-editvalue">
              <span>{{ val }}</span>
              <n-icon size="20" class="go-cursor-pointer" @click="() => enterEditMode(key)">
                <EditIcon />
              </n-icon>
            </div>
            <div v-else class="modal-editvalue">
              <n-input-number v-model:value="tempValues[key]" :min="0" style="width: 100%;"/>
              <n-icon size="20" class="go-cursor-pointer" @click="() => handleSave(key)">
                <CheckmarkIcon />
              </n-icon>
              <n-icon size="20" class="go-cursor-pointer" @click="() => cancelEdit(key)">
                <CloseIcon />
              </n-icon>
            </div>
          </div>
          <div v-else>
            <n-input-number v-model:value="data[key]" :min="0" />
          </div>
        </div>
      </div>
      <div v-if="isWriteble">
        <div class="modal-porperty">{{ $t('device.value') }}</div>
        <div v-if="!editStates['vvalue']" class="modal-editvalue modal-editstyle" >
          <span>{{ value }}</span>
          <n-icon size="20" class="go-cursor-pointer" @click="() => enterEditMode('vvalue')">
            <EditIcon />
          </n-icon>
        </div>
        <div v-else class="modal-editvalue modal-editstyle">
          <n-input-number v-model:value="tempValues['vvalue']" :min="0" style="width: 100%;" />
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
import SVG_ICON from '@/svg/SVG_ICON'
import { ref, inject, watch, computed, reactive } from 'vue'
import { validateIntegerOrRange, modbusSelectTextMap, modbusSelectOptions } from '../../utils/utils'
import { createModbusPoint, readIotPoints, updateIotPoints } from '@/api/http'
import { MODBUS_ID_MAP } from '../../utils/propertyMap'
import { icon } from '@/plugins'
import { cloneDeep } from 'lodash-es'

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
  [key: string]: any
  name: string
  description: string
  function: string
  address: string
  count: number
  data_type: string
  byteorder: number
  wordorder: number
  divisor: number
}>({
  name: 'New Point',
  description: '',
  function: '03',
  address: '',
  count: 1,
  data_type: 'int16',
  byteorder: 1,
  wordorder: 1,
  divisor: 1
})

const value = ref()

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

const getPropertyParams = () => ({
  address: Number(data.value.address),
  count: data.value.count,
  data_type: data.value.data_type,
  byteorder: data.value.byteorder,
  wordorder: data.value.wordorder,
  divisor: data.value.divisor
})

const handleSave = async (key: any) => {
  if (key === 'vvalue') {
    writeValue(key)
  } else {
    handleSaveCommon(key)
  }
}

const handleSaveCommon = async (key: any) => {
  let load = {}

  if (key === 'name' || key === 'description') {
    load = { [key]: tempValues[key] }
  } else {
    data.value[key] = tempValues[key]

    const propertyObj = {
      function: data.value.function,
      parms: getPropertyParams()
    }

    load =
      key === 'address'
        ? { uid: data.value.address, property: propertyObj }
        : { property: propertyObj }
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
    if (!dataCheck(data.value)) {
      if (data.value.address.includes('-')) {
        addNewPoints()
      } else {
        addNewPoint()
      }
    }
  }
}

const dataCheck = (data: any) => {
  let flag = false

  //console.log(data)
  if (data.name === '') {
    window['$message'].warning(t('device.msg_enter_params'))
    flag = true
  }

  if (data.count === null) {
    window['$message'].warning(t('device.msg_enter_params'))
    flag = true
  }

  if (data.divisor === null) {
    window['$message'].warning(t('device.msg_enter_params'))
    flag = true
  }

  if (data.address === '' || !validateIntegerOrRange(data.address)) {
    window['$message'].warning(t('device.msg_enter_params'))
    flag = true
  }

  return flag
}

const addNewPoints = async () => {
  loading.value = true

  try {
    const [startStr, endStr] = data.value.address.split('-')

    const startAddress = parseInt(startStr, 10)
    const endAddress = parseInt(endStr, 10)

    // 批量创建点位数据
    const pointCount = endAddress - startAddress + 1

    const requests = Array.from({ length: pointCount }, (_, i) => {
      const currentAddress = startAddress + i

      const pointData: any = {
        uid: currentAddress.toString(),
        name: `${data.value.name} ${currentAddress}`,
        property: {
          function: data.value.function,
          parms: {
            address: currentAddress,
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
      }

      return createModbusPoint(pointData)
    })

    const BATCH_SIZE = 100
    const results: any[] = []

    for (let i = 0; i < requests.length; i += BATCH_SIZE) {
      const batch = requests.slice(i, i + BATCH_SIZE)
      const batchResults = await Promise.allSettled(batch)
      results.push(...batchResults)
    }

    // 处理结果
    const successes: string[] = []
    const failures: { uid: string; reason: string }[] = []

    results.forEach(result => {
      console.log('Batch result:', result)
      if (result.status === 'fulfilled') {
        if (result.value.status === 'OK') {
          successes.push(result.value.data.uid)
        } else {
          failures.push({
            uid: 'unknown',
            reason: `HTTP ${result.value.status}`
          })
        }
      } else {
        failures.push({
          uid: 'unknown',
          reason: result.reason.message || 'Network error'
        })
      }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
  } finally {
    refreshObjTable()
    loading.value = false
    emit('update:isShowModal', false)
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
          address: Number(data.value.address),
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

const writeValue = async (key: any) => {
  if (tempValues[key] === '' || tempValues[key] === null || tempValues[key] === undefined) {
    window['$message'].error(t('device.msg_value_error'))
    return
  }

  const func = data.value.function === '03' ? '06' : '05'
  try {
    const res: any = await readIotPoints(props.deviceData.key, {
      function: func,
      parms: {
        address: data.value.address,
        value: tempValues[key],
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


    value.value = tempValues[key]
    editStates[key] = false

  } catch (e) {
    console.error('onSubmit:', e)
  }
}

const onClose = () => {
  emit('update:isShowModal', false)
}

watch(
  () => props.isEdit,
  newVal => {
    if (newVal) {
      data.value = {
        name: props.editData.metric_name,
        description: props.editData.description,
        function: props.editData.properties.function,
        address: props.editData.properties.parms.address.toString(),
        count: props.editData.properties.parms.count,
        data_type: props.editData.properties.parms.data_type,
        byteorder: props.editData.properties.parms.byteorder,
        wordorder: props.editData.properties.parms.wordorder,
        divisor: props.editData.properties.parms.divisor
      }
      if (props.editData.value) {
        value.value = parseFloat(props.editData.value)
      }

      //console.log(props.editData)
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

// ::v-deep(.n-input__input-el) {
//   border-bottom: 1px solid #{$--color-dark-modal-title};
// }

::v-deep(.n-select) {
  //border-bottom: 1px solid #{$--color-dark-modal-title};
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
