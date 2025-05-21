<template>
  <div>
    <n-space class="top" justify="space-between" align="center">
      <n-space>
        <n-icon size="20" class="top-icon" @click="onBack">
          <ChevronBackOutlineIcon />
        </n-icon>
        <span class="top-title">{{ deviceData.device_name }}</span>
      </n-space>
    </n-space>

    <div class="content">
      <div class="content-filter">
        <div style="display: flex; align-items: center; gap: 16px">
          <div>
            <n-input v-model:value="keyword" type="text" clearable style="width: 366px" />
          </div>
          <!-- <div class="content-button content-button-color1" @click="onSearch">
            {{ $t('device.search') }}
          </div> -->
        </div>
        <div style="display: flex; gap: 16px">
          <div class="content-button content-button-color2" @click="onDeleteAll">
            {{ $t('device.delete_all') }}
          </div>
          <div class="content-button content-button-color1" @click="onDiscovery">
            {{ $t('global.r_add') }}
          </div>
        </div>
      </div>
      <n-data-table
        :columns="columns"
        :bordered="false"
        :data="filteredData"
        :max-height="height - 44"
        :loading="loading"
        :row-key="(row: PointData) => row.key"
        size="small"
        virtual-scroll
      />
      <ObjectSetModal
        v-if="isShowModal"
        v-model:isShowModal="isShowModal"
        :deviceData="deviceData"
        :dataList="data"
      />
      <PropertyDisplayModal
        v-if="isDisplay"
        v-model:isShowModal="isDisplay"
        :displayData="displayData"
        :deviceData="deviceData"
      />
      <ModbusPropertyModal
        v-if="isModbus"
        v-model:isShowModal="isModbus"
        :isEdit="isModbusEdit"
        :deviceData="deviceData"
        :editData="displayData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { icon } from '@/plugins'
import { ref, onMounted, provide, nextTick, h, computed, onUnmounted } from 'vue'
import {
  DEVICE_TYPE_MAP,
  DeviceTypeEnum,
  PointData,
  formatTimestamp,
  isEmptyObject
} from '../../utils/utils'
import { NIcon } from 'naive-ui'
import SVG_ICON from '@/svg/SVG_ICON'
import { ObjectSetModal } from '../../modal/ObjectSetModal'
import { ModbusPropertyModal } from '../../modal/ModbusPropertyModal'
import { PropertyDisplayModal } from '../../modal/PropertyDisplayModal'
import {
  readSubscribePoints,
  readPointValue,
  deleteSubscribePoint,
  deleteAllSubscribePoint
} from '@/api/http'
import { TypeEnum } from '../../utils/propertyMap'
import { cloneDeep } from 'lodash'
import type { DataTableColumns } from 'naive-ui'

const { ChevronBackOutlineIcon } = icon.ionicons5
const { DeleteIcon, EditIcon } = icon.carbon

const emit = defineEmits(['goback'])
const props = defineProps({
  deviceData: {
    type: Object,
    required: true
  }
})

const t = window['$t']
const isShowModal = ref(false)
const isDisplay = ref(false)
const isModbus = ref(false)

const isModbusEdit = ref(false)

const height = ref(Number(document.documentElement.clientHeight) - 80 - 32 - 60 - 90)

const selectDevice = ref('')
const filterString = ref('')
const data = ref<PointData[]>([])

const displayData = ref<any>({})

const loading = ref(false)

let interval: number

const columns: DataTableColumns<PointData> = [
  { title: () => t('device.object_name'), key: 'metric_name' },
  {
    title: () => t('device.id'),
    key: 'metric_uid',
    render(row, index) {
      if (props.deviceData.device_type === DeviceTypeEnum.BACnet) {
        return DEVICE_TYPE_MAP[row.metric_type] + ',' + row.metric_id
      } else if (props.deviceData.device_type === DeviceTypeEnum.ModbusRTU) {
        return row.metric_uid
      }
    }
  },
  { title: () => t('device.value'), key: 'value' },
  { title: () => t('device.desc'), key: 'description' },
  { title: () => t('dashboard.time'), key: 'tags' },
  {
    title: '',
    key: 'actions',
    width: 120,
    render(row, index) {
      return [
        h(
          NIcon,
          { size: 24, style: 'margin-right: 24px;cursor: pointer;', onClick: () => onEdit(row) },
          () => h(EditIcon)
        ),
        h(NIcon, { size: 24, style: 'cursor: pointer;', onClick: () => deleteRow(row) }, () =>
          h(DeleteIcon)
        )
      ]
    }
  }
]

// 搜索关键字
const keyword = ref('')

const onSearch = () => {
  console.log(typeof keyword.value, keyword.value)
}

const filteredData = computed(() => {
  if (keyword.value === '') return data.value

  const searchTerm = keyword.value.toLowerCase()

  return data.value.filter(item => {
    return Object.values(item).some(value => {
      return String(value).toLowerCase().includes(searchTerm)
    })
  })
})

onMounted(() => {
  initData()
})

onUnmounted(() => {
  clearInterval(interval)
})

const initData = async () => {
  loading.value = true

  try {
    const res: any = await readSubscribePoints(props.deviceData.key)

    if (res.status !== 'OK' || res.data === null) {
      console.warn('Non-OK response status:', res.status)
      return
    }

    const transformedData: PointData[] = res.data.map((item: any, index: number) => ({
      key: item.id,
      metric_uid: item.uid,
      metric_id: item.uid.includes(',') ? item.uid.split(',')[1] : item.uid,
      metric_type: item.uid.includes(',') ? parseInt(item.uid.split(',')[0]) : '',
      metric_name: item.name || '',
      unit: '',
      value: '',
      description: '',
      properties: item.property || {},
      tags: item.tags || [],
      device_id: props.deviceData.device_id
    }))

    //console.log('props.deviceData', transformedData)
    data.value = [...transformedData]
    periodicReading()
  } catch (e) {
    console.error('Failed to fetch Points:', e)
  } finally {
    loading.value = false
  }
}

const periodicReading = () => {
  // 立即清除已有定时器
  clearInterval(interval)

  // 数据源为空时不创建新定时器
  if (data.value.length === 0) return

  periodicFunc()
  //周期读取值
  interval = window.setInterval(async () => {
    if (!isShowModal.value && !isDisplay.value && !isModbus.value) {
      periodicFunc()
    }
  }, 3000)
}

const periodicFunc = async () => {
  try {
    const response: any = await readPointValue(props.deviceData.key)

    if (response.status !== 'OK') {
      console.warn('Non-OK response status:', response.status)
      return
    }

    // 创建快速查询映射
    const metricPoints = new Map(response.data.map((point: any) => [point.metric_id, point]))
    // 生成新的数据源（不可变更新）
    const updatedData = data.value.map(originalItem => {
      const point: any = metricPoints.get(originalItem.key)
      if (!point) return originalItem

      return {
        ...originalItem,
        value: getProcessedValue(point, originalItem.metric_type),
        properties: mergeProperties(point.property, originalItem.properties),
        description: point.property?.description ?? originalItem.description,
        tags: formatTimestamp(point.timestamp)
      }
    })

    // 更新状态
    data.value = updatedData
  } catch (e) {
    console.error('Failed to fetch Points:', e)
  }
}

const getProcessedValue = (point: any, metricType: any) => {
  const deviceType = DEVICE_TYPE_MAP[metricType]

  switch (deviceType) {
    case TypeEnum.BI:
    case TypeEnum.BV:
    case TypeEnum.BO: {
      const status = point.value === 'inactive' ? 'inactive-text' : 'active-text'
      return point.property?.[status] ?? point.value
    }

    case TypeEnum.MV: {
      const states = point.property?.['state-text'] || []
      const index = point.value - 1

      if (index >= 0 && index < states.length) {
        return states[index]
      }
      console.warn(`Invalid state index (${index}) for MV metric ${point.metric_id}`)
      return point.value
    }

    default:
      return point.value?.toString() ?? ''
  }
}

const mergeProperties = (newProps: any, fallback: any) => {
  return newProps && Object.keys(newProps).length > 0 ? newProps : fallback
}

const onDiscovery = () => {
  //console.log('device data', props.deviceData)
  if (props.deviceData.device_type === DeviceTypeEnum.BACnet) {
    isShowModal.value = true
  } else if (props.deviceData.device_type === DeviceTypeEnum.ModbusRTU) {
    isModbus.value = true
    isModbusEdit.value = false
  }
}

const onReset = (row: PointData) => {}

const onEdit = (row: PointData) => {
  displayData.value = row
  if (props.deviceData.device_type === DeviceTypeEnum.BACnet) {
    isDisplay.value = true
  } else if (props.deviceData.device_type === DeviceTypeEnum.ModbusRTU) {
    isModbusEdit.value = true
    isModbus.value = true
  }
}

const deleteRow = async (row: PointData) => {
  loading.value = true
  try {
    const res: any = await deleteSubscribePoint(row.key)

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      window['$message'].warning(t('device.msg_del_fail') + res.status)
      loading.value = false
      return
    }
    initData()
  } catch (e) {
    console.error('Failed to delete devices:', e)
    loading.value = false
  }
}

const onDeleteAll = async () => {
  try {
    const res: any = await deleteAllSubscribePoint(props.deviceData.key)

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      window['$message'].warning(t('device.msg_del_fail') + res.status)
      return
    }

    clearInterval(interval)
    data.value = []
    await nextTick()
  } catch (e) {
    console.error('Failed to delete devices:', e)
  }
}

const onBack = () => {
  // Navigate back to the previous page
  clearInterval(interval)
  emit('goback')
}

provide('refreshObjTable', initData)
</script>

<style lang="scss" scoped>
.top {
  height: #{$--card-top-height};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;

  &-title {
    font-size: 16px;
    font-weight: bold;
    color: #ffffffed;
    font-style: normal;
    text-transform: none;
  }

  &-icon {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.content {
  padding: 0 16px;

  &-title {
    font-weight: 400;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 0px;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }

  &-filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    margin-bottom: 12px;
    padding-left: 12px;
    height: 48px;
  }

  &-button {
    width: 88px;
    height: 32px;
    border-radius: 2px;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &-color1 {
      background-color: #{$--color-dark-button1};
    }

    &-color2 {
      background-color: #{$--color-dark-button2};
      border: 1px solid #{$--color-dark-button2-border};
    }
  }
}

::v-deep(.n-input) {
  background: transparent;
}
::v-deep(.n-input--focus) {
  background: transparent !important;
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
  --n-color-active: transparent !important;
  --n-color-disabled: transparent !important;
  --n-padding-single: 0 26px 0 0 !important;
}

::v-deep(.n-base-selection-label) {
  background: transparent;
}

::v-deep(.n-data-table-table) {
  background-color: transparent !important;
}

::v-deep(.n-data-table-thead) {
  background-color: transparent !important;
}

::v-deep(.n-data-table-th) {
  background-color: transparent !important;
}

::v-deep(.n-data-table-tr:hover) {
  background-color: transparent !important;
}

::v-deep(.n-data-table-td) {
  background-color: transparent !important;
}

::v-deep(.n-data-table-tbody .n-data-table-tr:nth-child(odd)) {
  background-color: rgba(255, 255, 255, 0.07) !important;
}

::v-deep(.n-data-table-td) {
  border: none !important;
}

::v-deep(.n-data-table-tbody .n-data-table-tr:nth-child(even)) {
  background-color: transparent !important;
}

::v-deep(.n-data-table-tbody .n-data-table-tr:nth-child(odd)) td:first-child {
  border-radius: 8px 0 0 8px !important;
}

::v-deep(.n-data-table-tbody .n-data-table-tr:nth-child(odd)) td:last-child {
  border-radius: 0 8px 8px 0 !important;
}
</style>
