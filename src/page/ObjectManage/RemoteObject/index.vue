<template>
  <div class="project">
    <div v-if="!isToggle" class="project-card">
      <div class="project-card-top">
        <div class="project-card-top-title">{{ $t('device.device_list') }}</div>
        <div>
          <n-button class="project-card-top-extra-button" @click="onAdd">
            {{ $t('global.r_add') }}
          </n-button>
        </div>
      </div>
      <div class="project-card-content" :style="{ height: height + 'px' }">
        <a-table
          class="ant-table-striped"
          size="middle"
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
          </template>
        </a-table>
      </div>
      <DeviceSetModal v-model:isShowModal="isShowModal" />
    </div>
    <div v-else class="project-card">
      <ObjectList @goback="goback" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NButton } from 'naive-ui'
import { deviceDataType } from './utils/utils'
import { ObjectList } from './components/ObjectList'
import { DeviceSetModal } from './modal/DeviceSetModal'
import SVG_ICON from '@/svg/SVG_ICON'

const t = window['$t']

const isToggle = ref(false)
const isShowModal = ref(false)

const deviceData = ref([])

const data = ref<deviceDataType[]>([
  {
    id: '',
    name: 'string',
    type: 'string',
    polling: 'string',
    address: 'string',
    status: 'string',
    enabled: 'true'
  }
])
const height = ref(Number(document.documentElement.clientHeight) - 80 - 32 - 72)

const columns = [
  { title: '', dataIndex: 'link', width: 50 },
  { title: () => t('device.name'), dataIndex: 'name' },
  { title: () => t('device.type'), dataIndex: 'type' },
  { title: () => t('device.polling'), dataIndex: 'polling' },
  { title: () => t('device.address'), dataIndex: 'address' },
  { title: () => t('device.status'), dataIndex: 'status' },
  { title: () => t('device.enabled'), dataIndex: 'enabled' },
  { title: '', dataIndex: 'actions', width: 120 }
]

onMounted(() => {
  console.log(height.value)
  initData()
})
/*
{
    "name": "Modbus1",
    "renamed": false,
    "id": 1,
    "connect_mode": "Serial Port",
    "serial_port": "COM7",
    "baudrate": 115200,
    "data_bit": 8,
    "parity": "None",
    "stop_bit": 1,
    "mode": "RTU"
}
*/
const initData = () => {
  for (let index = 0; index < 100; index++) {
    data.value.push({
      id: index.toString(),
      name: `Device ${index + 1}`,
      type: 'ModbusRTU',
      polling: '1s',
      address: '192.168.1.1',
      status: 'Connected',
      enabled: 'true'
    });
  }
}

const goback = () => {
  isToggle.value = false
  deviceData.value = []
}

const onAdd = () => {
  isShowModal.value = true
}

const onEdit = (row: any) => {
  isShowModal.value = true
}

const deleteRow = (row: any) => {
  data.value = data.value.filter((item: any) => item.id !== row.id)
}

const onEnter = (row: any) => {
  isToggle.value = true
}

//update table
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
