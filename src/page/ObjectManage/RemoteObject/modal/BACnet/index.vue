<template>
  <div class="content">
    <div class="content-title">
      <span class="content-porperty">{{ t('device.device_list') }}</span>
      <div style="display: flex; align-items: center; justify-content: flex-end; gap: 32px">
        <!-- <div>
          <n-select v-model:value="networkCard" :options="options" style="width: 200px" />
        </div> -->
        <div class="content-button" @click="onDiscovery">{{ $t('device.search') }}</div>
      </div>
    </div>
    <a-table
      class="ant-table-striped"
      size="middle"
      :loading="loading"
      :columns="columns"
      :data-source="data"
      :scroll="{ y: 400 }"
      :pagination="false"
      :row-class-name="(_record: any, index: any) => (index % 2 === 1 ? 'table-striped1' : 'table-striped2')"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'actions'">
          <n-icon
            v-if="!record.disabled"
            size="24"
            @click="onDownload(record)"
            style="cursor: pointer"
          >
            <DownloadOutlineIcon />
          </n-icon>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { discoveryDevices, addDevice, getNetWorkCards } from '@/api/http'
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { icon } from '@/plugins'
import { DeviceTypeEnum } from '../../utils/utils'

const { DownloadOutlineIcon } = icon.ionicons5
defineProps({
  isEdit: {
    type: Boolean,
    required: false
  },
  data: {
    type: Object,
    required: true
  }
})

const deviceList: any = inject('deviceList')

const t = window['$t']

interface DataType {
  key: number
  object_name: string
  model_name: string
  vendor_name: string
  address: string
  id: string
  type: string
  disabled?: boolean
}

const data = ref<DataType[]>([])
const loading = ref(false)

const networkCard = ref('')

const columns = [
  { title: () => t('device.name'), dataIndex: 'object_name' },
  { title: () => t('device.slave_id'), dataIndex: 'id' },
  { title: () => t('device.address'), dataIndex: 'address' },
  { title: () => t('device.vendor'), dataIndex: 'vendor_name' },
  { title: '', dataIndex: 'actions', width: 80, align: 'center' }
]

//NetWork
const options = ref<any[]>([])

onMounted(() => {
  // 初始化时获取网卡
  getNetWorks()
})

onUnmounted(() => {
  // 清理数据
  data.value = []
  options.value = []
  networkCard.value = ''
})

const getNetWorks = async () => {
  try {
    const res: any = await getNetWorkCards()

    if (res.status !== 'OK' || res.data.length === 0) {
      window['$message'].warning(t('device.msg_no_network_card'))
      return
    }

    res.data.forEach((item: any) => {
      options.value.push({
        label: item.name,
        value: item.addr
      })
    })
  } catch (e) {
    console.error('Failed to fetch network cards:', e)
  }
}

const onDiscovery = async () => {
  // if (networkCard.value === '') {
  //   window['$message'].warning(t('device.msg_no_select_card'))
  //   return
  // }

  loading.value = true

  try {
    const res: any = await discoveryDevices()

    if (res.status !== 'OK' || res.data.length === 0) {
      console.warn('Non-OK response status:', res.status)
      window['$message'].warning(t('device.msg_read_fail'))
      return
    }

    const transformedData: DataType[] = res.data.map((item: any, index: number) => ({
      key: index + 1,
      object_name: item['object-name'],
      model_name: item['model-name'],
      vendor_name: item['vendor-name'],
      address: item.addr,
      id: item.id,
      type: item.type
    }))

    //标记是否已添加
    data.value = markExistingIds(transformedData, deviceList.value)

    //console.log('data.value:', data.value)
  } catch (e) {
    console.error('Failed to fetch devices:', e)
  } finally {
    loading.value = false
  }
}

function markExistingIds(arrayA: any[], arrayB: any[]): (any & { isExist: boolean })[] {
  // 提取第二个数组的所有 ID 到 Set
  const idsInB = new Set(arrayB.map(item => item.device_id))

  // 遍历第一个数组并标记是否存在
  return arrayA.map(item => ({
    ...item,
    disabled: idsInB.has(item.id)
  }))
}

const onDownload = async (record: DataType) => {
  try {
    const res: any = await addDevice({
      uid: record.id,
      name: record.object_name,
      address: record.address,
      protocol: DeviceTypeEnum.BACnet,
      enabled: false,
      status: '',
      description: '',
      property: {
        'model-name': record.model_name,
        'vendor-name': record.vendor_name
      },
      tags: ''
    })

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      window['$message'].warning(t('device.msg_add_device_fail'))
      return
    }

    window['$message'].success(t('device.msg_add_device_success'))
    //修改标记，切换图标
    data.value.map(item => {
      if (record.id === item.id) {
        item.disabled = true
      }
    })
  } catch (e) {
    console.error('Failed to add devices:', e)
  }
}
</script>

<style lang="scss" scoped>
.content {
  margin-top: 16px;
  margin-bottom: 16px;

  &-title {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-button {
    width: 64px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background: #783afe;
    border-radius: 2px;
    border: 1px solid rgba(255, 255, 255, 0.07);
  }

  &-porperty {
    font-weight: bold;
    font-size: 16px;
    color: #ffffff;
    line-height: 24px;
    text-align: center;
    font-style: normal;
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
