<template>
  <div class="project">
    <div v-if="!isToggle" class="project-card">
      <div class="project-card-top">
        <div class="project-card-top-title">{{ $t('device.device_list') }}</div>
        <n-space justify="end" align="center">
          <!-- <n-dropdown
            trigger="hover"
            :options="options"
            placement="bottom-end"
            @select="handleSelect"
          >
            <img width="24" height="24" :src="SVG_ICON.card_icons.list" style="cursor: pointer" />
          </n-dropdown> -->
          <n-button class="project-card-top-extra-button" @click="onAdd">
            {{ $t('global.r_add') }}
          </n-button>
        </n-space>
      </div>
      <div class="project-card-content" :style="{ height: height + 'px' }">
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
            <template v-if="column.dataIndex === 'link'">
              <img
                width="24"
                height="24"
                :src="SVG_ICON.card_icons.file"
                @click="onEnter(record)"
                style="cursor: pointer"
              />
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
            <template v-else-if="column.dataIndex === 'enabled'">
              <a-switch v-model:checked="record.enabled" @click="onChange(record)" />
            </template>
          </template>
        </a-table>
      </div>
      <DeviceSetModal v-model:isShowModal="isShowModal" :isEdit="isEdit" :deviceData="deviceData" />
      <PropertyDisplayModal
        v-if="isDisplay"
        v-model:isShowModal="isDisplay"
        :displayData="displayData"
        :deviceData="deviceData"
      />
    </div>
    <div v-else class="project-card">
      <ObjectList :deviceData="deviceData" @goback="goback" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import { NButton } from 'naive-ui'
import { DeviceTableData } from './utils/utils'
import { ObjectList } from './components/ObjectList'
import { DeviceSetModal } from './modal/DeviceSetModal'
import { PropertyDisplayModal } from './modal/PropertyDisplayModal'
import SVG_ICON from '@/svg/SVG_ICON'
import { renderImage, routerTurnByName } from '@/utils'
import { PageEnum } from '@/enums/pageEnum'
import { setDeviceEnable, getDeviceList, deleteDevice, readIotPoints } from '@/api/http'
import jsonList from '@/assets/data/Property.json'
import { deviceTrans } from './utils/propertyMap'

const t = window['$t']

const isToggle = ref(false)
const isShowModal = ref(false)
const isDisplay = ref(false)

const isEdit = ref(false)

const deviceData = ref({})
const displayData = ref({})

const data = ref<DeviceTableData[]>([])
const loading = ref(false)

const height = ref(Number(document.documentElement.clientHeight) - 80 - 32 - 72)

const columns = [
  { title: '', dataIndex: 'link', width: 50 },
  { title: () => t('device.name'), dataIndex: 'device_name' },
  { title: () => t('device.type'), dataIndex: 'device_type' },
  { title: () => t('device.polling'), dataIndex: 'polling' },
  { title: () => t('device.address'), dataIndex: 'address' },
  { title: () => t('device.status'), dataIndex: 'status' },
  { title: () => t('device.enabled'), dataIndex: 'enabled' },
  { title: '', dataIndex: 'actions', width: 120 }
]

onMounted(() => {
  //console.log(height.value)
  initData()
})

const initData = async () => {
  loading.value = true
  try {
    const res: any = await getDeviceList()
    //console.log('API Response:', res)

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      return
    }

    if (res.data.length === 0) {
      console.warn('No devices found in the response data')
      window['$message'].warning(t('device.device_no_data'))
      return
    }

    data.value = res.data.map((item: any, index: number) => ({
      key: item.id, // 保持 number 类型
      device_id: item.uid || '',
      device_name: item.name || '',
      device_type: item.protocol || '',
      polling: 3, // 确保数字类型
      address: item.address || '',
      status: item.status || '',
      enabled: item.enabled, // 确保数字类型
      properties: item.property || {},
      tags: item.tags || []
    }))
  } catch (e) {
    console.error('Failed to fetch devices:', e)
  } finally {
    loading.value = false
  }
}

const onChange = async (record: DeviceTableData) => {
  //console.log(record.key, record.enabled)
  try {
    const res: any = await setDeviceEnable(record.key, record.enabled)

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      window['$message'].warning(t('device.enable_mod_fail'))
      return
    }
    window['$message'].success(t('device.enable_mod_success'))
  } catch (e) {
    console.error('onChange:', e)
  }
}

const goback = () => {
  isToggle.value = false
  deviceData.value = {}
}

const onAdd = () => {
  deviceData.value = {}
  isEdit.value = false
  isShowModal.value = true
}

const onEdit = (row: DeviceTableData) => {
  deviceData.value = row
  //读取设备属性
  readDeviceData(row)
}

const readDeviceData = async (row: DeviceTableData) => {
  try {
    const res: any = await readIotPoints(row.key, {
      function: 'read_property_multiple',
      parms: {
        address: row.address,
        read_list: [row.device_id, jsonList['Device']]
      }
    })

    if (res.status !== 'OK' || res.data === null || res.data.length === 0) {
      console.warn('Non-OK response status:', res.status)
      window['$message'].warning(t('device.msg_read_fail') + res.status)
      return
    }

    //格式转换
    displayData.value = {
      properties: deviceTrans(res.data)
    }
    //console.log(displayData.value)
  } catch (e) {
    console.error('Failed to fetch Points:', e)
  } finally {
    loading.value = false
    isDisplay.value = true
  }
}

const deleteRow = async (row: DeviceTableData) => {
  try {
    const res: any = await deleteDevice(row.key)

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      window['$message'].warning(t('device.msg_del_fail') + res.status)
      return
    }

    data.value = data.value.filter((item: DeviceTableData) => item.key !== row.key)
  } catch (e) {
    console.error('Failed to delete devices:', e)
  }
}

const onEnter = (row: DeviceTableData) => {
  deviceData.value = row
  isToggle.value = true
}

//menu
const options: any[] = [
  {
    label: () => t('device.import_devices'),
    key: '1',
    icon: renderImage(SVG_ICON.card_icons.import_, '', 24, 24)
  },
  {
    label: () => t('device.export_devices'),
    key: '2',
    icon: renderImage(SVG_ICON.card_icons.export_, '', 24, 24)
  },
  {
    label: () => t('device.refresh'),
    key: '3',
    icon: renderImage(SVG_ICON.card_icons.restart, '', 24, 24)
  }
]
const handleSelect = () => {}

provide('deviceList', data)
provide('refreshFunc', initData)
</script>

<style lang="scss" scoped>
.project {
  height: calc(100vh - #{$--header-height});
  padding: 16px;

  &-card {
    background-color: #{$--color-dark-side};
    border-radius: 18px;
    backdrop-filter: blur(50px);
    height: 100%;

    &-top {
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
        font-family: Source Han Sans SC, Source Han Sans SC;
      }

      &-extra {
        &-button {
          width: 64px;
          height: 32px;
          border-radius: 2px;
          font-size: 14px;
        }
      }
    }

    &-content {
      padding: 0 16px;
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
</style>
