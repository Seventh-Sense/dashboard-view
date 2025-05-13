<template>
  <div>
    <n-space class="top" justify="space-between" align="center">
      <n-space>
        <n-icon size="20" class="top-icon" @click="onBack">
          <ChevronBackOutlineIcon />
        </n-icon>
        <span class="top-title">{{ deviceData.device_name }}</span>
      </n-space>
      <div style="display: flex; gap: 16px">
        <div class="content-button content-button-color2" @click="onDeleteAll">
          {{ $t('device.delete_all') }}
        </div>
        <div class="content-button content-button-color1" @click="onDiscovery">
          {{ $t('global.r_add') }}
        </div>
      </div>
    </n-space>

    <div class="content">
      <!-- <div class="content-filter">
        <div>
          <div class="content-title">设备</div>
          <n-select
            v-model:value="selectDevice"
            placeholder="Select"
            :options="data"
            style="width: 200px"
          />
        </div>
        <div>
          <div class="content-title">过滤器</div>
          <n-input v-model:value="filterString" type="text" style="width: 366px" />
        </div>

        <div class="content-button content-button-color2" @click="onReset">
          {{ $t('device.reset') }}
        </div>

        <div class="content-button content-button-color1">
          {{ $t('device.search') }}
        </div>
      </div> -->
      <a-table
        class="ant-table-striped"
        size="middle"
        :loading="loading"
        :columns="columns"
        :data-source="data"
        :scroll="{ y: height - 44 }"
        :pagination="false"
        :row-class-name="(_record: any, index: any) => (index % 2 === 1 ? 'table-striped1' : 'table-striped2')"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'metric_type'">
            {{ DEVICE_TYPE_MAP[record.metric_type] }}
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <img
              width="24"
              height="24"
              :src="SVG_ICON.card_icons.edit"
              style="cursor: pointer; margin-right: 40px"
              @click="onEdit(record)"
            />
            <img
              width="24"
              height="24"
              :src="SVG_ICON.card_icons.delete_red"
              style="cursor: pointer"
              @click="deleteRow(record)"
            />
          </template>
        </template>
      </a-table>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { icon } from '@/plugins'
import { ref, onMounted, provide, nextTick } from 'vue'
import { DEVICE_TYPE_MAP, PointData, tagDataType } from '../../utils/utils'
import { NButton, NIcon } from 'naive-ui'
import SVG_ICON from '@/svg/SVG_ICON'
import { ObjectSetModal } from '../../modal/ObjectSetModal'
import { PropertyDisplayModal } from '../../modal/PropertyDisplayModal'
import {
  readSubscribePoints,
  readPointValue,
  deleteSubscribePoint,
  deleteAllSubscribePoint
} from '@/api/http'
import { TypeEnum } from '../../utils/propertyMap'
import { set } from 'lodash'

const { ChevronBackOutlineIcon } = icon.ionicons5

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

const height = ref(Number(document.documentElement.clientHeight) - 80 - 32 - 90)

const selectDevice = ref('')
const filterString = ref('')
const data = ref<PointData[]>([])

const displayData = ref<any>()

const loading = ref(false)

let interval: number

const columns = [
  { title: () => t('device.object_name'), dataIndex: 'metric_name' },
  { title: () => t('device.type'), dataIndex: 'metric_type' },
  { title: () => t('device.id'), dataIndex: 'metric_id' },
  { title: () => t('device.value'), dataIndex: 'value' },
  { title: () => t('device.desc'), dataIndex: 'description' },
  { title: '', dataIndex: 'actions', width: 120 }
]

onMounted(() => {
  console.log('object list mounted')
  initData()
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
      metric_id: item.uid.split(',')[1] || '',
      metric_type: parseInt(item.uid.split(',')[0]),
      metric_name: item.name || '',
      unit: '',
      value: '',
      description: '',
      properties: item.property || {},
      tags: item.tags || [],
      device_id: props.deviceData.device_id
    }))

    //console.log('props.deviceData', transformedData)
    periodicReading(transformedData)
  } catch (e) {
    console.error('Failed to fetch Points:', e)
  } finally {
    loading.value = false
  }
}

const periodicReading = (dataSource: any) => {
  // 立即清除已有定时器
  clearInterval(interval)

  // 数据源为空时不创建新定时器
  if (dataSource.length === 0) return

  periodicFunc(dataSource)
  //周期读取值
  interval = window.setInterval(async () => {
    if (!isShowModal.value && !isDisplay.value) {
      periodicFunc(dataSource)
    }
  }, 3000)
}

const periodicFunc = async (dataSource: any) => {
  try {
    const res: any = await readPointValue(props.deviceData.key)

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      return
    }

    // 创建metric_id到point的映射
    const pointsMap = new Map<string, any>(res.data.map((point: any) => [point.metric_id, point]))

    // 生成新的数据源（不可变更新）
    const newData = dataSource.map((item: any) => {
      const point = pointsMap.get(item.key)

      //console.log(pointsMap)
      let value = ''
      //value 翻译
      if (point) {
        let type = DEVICE_TYPE_MAP[item.metric_type]

        if (type === TypeEnum.BI || type === TypeEnum.BV || type === TypeEnum.BO) {
          value =
            point.value === 'inactive'
              ? point.property['inactive-text']
              : point.property['active-text']
        } else if (type === TypeEnum.MV) {
          let array = point.property['state-text']
          value = array[point.value - 1]
        } else {
          value = point.value
        }
      }

      return point
        ? {
            ...item,
            value: value,
            properties: point.property,
            description: point.property?.description
          }
        : item
    })

    // 更新状态
    data.value = newData
  } catch (e) {
    console.error('Failed to fetch Points:', e)
  }
}

const onDiscovery = () => {
  isShowModal.value = true
}

const onReset = (row: PointData) => {}

const onEdit = (row: PointData) => {
  displayData.value = row
  isDisplay.value = true
}

const deleteRow = async (row: PointData) => {
  try {
    const res: any = await deleteSubscribePoint(row.key)

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      window['$message'].warning(t('device.msg_del_fail') + res.status)
      return
    }

    initData()
  } catch (e) {
    console.error('Failed to delete devices:', e)
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
    justify-content: flex-start;
    align-items: flex-end;
    gap: 24px;
    margin-bottom: 12px;
    padding-left: 12px;
    height: 60px;
  }

  &-button {
    width: 72px;
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

:deep(.ant-table) {
  background: transparent !important;
}

:deep(.ant-table-thead) tr th {
  background: transparent !important;
  border: 0 !important;
}

:deep(.ant-table-tbody) tr td {
  border: 0 !important;
}

:deep(.ant-table-row):hover {
  background: transparent !important;
}

:deep(.ant-table-row):hover td {
  background: transparent !important;
}

:deep(.ant-table-cell-row-hover) {
  background: rgba(255, 255, 255, 0.07) !important;
}

:deep(.ant-table-cell) {
  height: 44px !important;
  padding: 0 8px !important;
}

:deep(.ant-table-placeholder :hover) {
  background-color: transparent !important;
}

.ant-table-striped :deep(.table-striped1) td {
  background-color: transparent !important;
}

.ant-table-striped :deep(.table-striped1):hover td {
  background-color: transparent !important;
}

.ant-table-striped :deep(.table-striped2) td {
  background: rgba(255, 255, 255, 0.07) !important;
}

.ant-table-striped :deep(.table-striped2):hover td {
  background: rgba(255, 255, 255, 0.07) !important;
}

.ant-table-striped :deep(.table-striped2) td:first-child {
  border-radius: 8px 0 0 8px !important;
}

.ant-table-striped :deep(.table-striped2) td:last-child {
  border-radius: 0 8px 8px 0 !important;
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
</style>
