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
      <div class="modal-top">
        <n-grid x-gap="36" :cols="2">
          <n-gi span="1" class="modal-gi">
            <div class="modal-porperty">{{ $t('device.id') }}</div>
            <n-input v-model:value="deviceData.device_id" type="text" disabled />
          </n-gi>
          <n-gi span="1" class="modal-gi">
            <div class="modal-porperty">{{ $t('device.address') }}</div>
            <n-input v-model:value="deviceData.address" type="text" disabled />
          </n-gi>
        </n-grid>
      </div>
      <div>
        <a-table
          class="ant-table-striped"
          size="middle"
          rowKey="key"
          :loading="loading"
          :columns="columns"
          :data-source="data"
          :scroll="{ y: 550 }"
          :row-selection="rowSelection"
          :row-class-name="(_record: any, index: any) => (index % 2 === 1 ? 'table-striped1' : 'table-striped2')"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'type'">
              {{ DEVICE_TYPE_MAP[record.type] }}
            </template>
          </template>
        </a-table>
      </div>

      <template #footer>
        <n-space justify="end">
          <div class="modal-button-close" @click="onClose">{{ $t('global.r_cancel') }}</div>
          <n-button class="modal-button-ok" :loading="loadingButton" @click="onSubmit">
            {{ $t('global.r_ok') }}
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, unref, onMounted, inject, onUnmounted } from 'vue'
import SVG_ICON from '@/svg/SVG_ICON'
import { readIotPoints, addSubscribePoint } from '@/api/http'
import { cloneDeep } from 'lodash-es'
import axiosTwo from '@/api/axiosTwo'
import jsonList from '@/assets/data/Property.json'
import { DEVICE_TYPE_MAP } from '../../utils/utils'
import { width } from 'dom-helpers'

interface DataType {
  key: string
  name: string
  type: number
  id: string
  disabled?: boolean
}

let emit = defineEmits(['update:isShowModal'])
const props = defineProps({
  isShowModal: {
    type: Boolean,
    required: true
  },
  deviceData: {
    type: Object,
    required: true
  },
  dataList: {
    type: Array,
    required: true
  }
})
const refreshObjTable: any = inject('refreshObjTable')

const t = window['$t']
const data = ref<DataType[]>([])
const loading = ref(false)

const loadingButton = ref(false)

const columns = [
  { title: () => t('device.object_name'), dataIndex: 'name' },
  { title: () => t('device.type'), dataIndex: 'type', align: 'center', width: 200 },
  { title: () => t('device.id'), dataIndex: 'id', align: 'center', width: 100 }
]
const selectedObjKeys = ref<string[]>([])

const selectedRowKeys = ref<DataType['key'][]>([])

const rowSelection = computed(() => {
  return {
    selectedRowKeys: unref(selectedRowKeys),
    onSelect: (record: DataType, selected: boolean) => {
      // 处理单个选中和取消选中的逻辑
      const newKeys = selected
        ? [...selectedRowKeys.value, record.key]
        : selectedRowKeys.value.filter(key => key !== record.key)
      selectedRowKeys.value = newKeys
    },
    onSelectAll: (selected: boolean) => {
      // 处理全选和全不选的逻辑
      const newKeys = selected ? data.value.map(item => item.key) : []
      selectedRowKeys.value = newKeys
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.disabled === true,
      name: record.name
    })
  }
})

onMounted(() => {
  fetchData()
})

onUnmounted(() => {
  selectedObjKeys.value = []
  selectedRowKeys.value = []
  data.value = []
})

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await readIotPoints(props.deviceData.key, {
      function: 'read_property',
      parms: {
        address: props.deviceData.address,
        objid: props.deviceData.device_id,
        prop: 'objectList'
      }
    })

    if (res.status === 'OK' && res.data.length > 0) {
      let tmp: DataType[] = convertToDataTypes(props.dataList, res.data)

      //console.log(tmp)
      fetchProperties(tmp)
    } else {
      loading.value = false
    }
  } catch (e) {
    console.error('Failed to fetch objectlist:', e)
    loading.value = false
  }
}

const convertToDataTypes = (selectedData: any[], resData: any[]): any[] => {
  const newKeys = selectedData.map(({ metric_type, metric_id }) => `${metric_type},${metric_id}`)

  selectedObjKeys.value = cloneDeep(newKeys)

  const mergedKeysSet = new Set([...selectedRowKeys.value, ...newKeys])
  console.log('mergedKeysSet', mergedKeysSet)

  selectedRowKeys.value = Array.from(mergedKeysSet)

  // 处理并返回结果数据
  return resData
    .filter(([typeNum]) => typeNum !== 8) // 过滤无效类型
    .map(([typeNum, idNum]) => {
      const compositeKey = `${typeNum},${idNum}` // 生成复合键

      return {
        key: compositeKey, // 唯一标识符
        name: '', // 保留字段（后续可能需要填充）
        type: parseInt(typeNum), // 确保字符串类型
        id: idNum.toString(), // 确保字符串类型
        disabled: mergedKeysSet.has(compositeKey) // 设置禁用状态
      }
    })
}

const fetchProperties = async (initialDatas: DataType[]) => {
  try {
    // 创建数据副本以避免修改原始数据
    const dataCopy = initialDatas.map(item => ({ ...item }))

    const dataMap = new Map<string, DataType>(dataCopy.map(item => [item.key.toString(), item]))

    // 分块处理
    const chunks = processDataChunks(initialDatas, 5)

    // 创建所有请求
    const requests = chunks.map(chunk =>
      axiosTwo.post(`/request?device_id=${props.deviceData.key}`, {
        function: 'read_property_multiple',
        parms: {
          address: props.deviceData.address,
          read_list: chunk
        }
      })
    )

    // 使用Promise.allSettled处理部分失败的情况
    const results = await Promise.allSettled(requests)

    // 处理响应结果
    results.forEach(result => {
      if (result.status === 'rejected') {
        console.error('请求失败:', result.reason)
        return
      }

      //console.log(result)
      const response: any = result.value
      if (response.status === 'OK') {
        response.data.forEach((item: any) => {
          const dataItem = dataMap.get(item[0].toString())
          if (dataItem && item[1] === 77) {
            dataItem.name = item[3]
          }
        })
      } else {
        console.error(`请求失败, HTTP状态码, ${response.status}`)
      }
    })

    //console.log(dataCopy)

    // 更新状态（创建新数组触发重新渲染）
    data.value = [...dataCopy]
  } catch (error) {
    console.error('请求失败:', error)
  } finally {
    loading.value = false
  }
}

const processDataChunks = (data: DataType[], CHUNK_SIZE: number): any[][] => {
  // 将数据分割成大小为 CHUNK_SIZE 的块
  const chunks = Array.from({ length: Math.ceil(data.length / CHUNK_SIZE) }, (_, index) =>
    data.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE)
  )

  // 处理每个块，生成 [key, objectName] 的扁平化数组
  return chunks.map(chunk => chunk.flatMap(item => [item.key, ['objectName']]))
}

const onClose = () => {
  emit('update:isShowModal', false)
}

const onSubmit = async () => {
  if (selectedRowKeys.value.length === 0) {
    return
  }

  loadingButton.value = true
  //console.log('selectedRowKeys', selectedRowKeys.value)
  //剔除已经选中过的点位
  const list = selectedRowKeys.value
    .map(key => {
      if (selectedObjKeys.value.includes(key)) return null // 跳过已选中的点位

      const record = data.value.find(item => item.key === key)
      if (!record) return null

      const type = DEVICE_TYPE_MAP[record.type] as keyof typeof jsonList
      const proList = jsonList[type] ?? []

      return {
        uid: `${record.type},${record.id}`,
        name: record.name,
        description: '',
        property: {
          pro_list: proList
        },
        tags: '',
        device_id: props.deviceData.key
      }
    })
    .filter(Boolean)

  console.log('list', list)

  try {
    const res: any = await addSubscribePoint(list)
    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      return
    }

    refreshObjTable()
  } catch (e) {
    console.warn('handleSubmit', e)
  } finally {
    loadingButton.value = false
    emit('update:isShowModal', false)
  }
}
</script>

<style lang="scss" scoped>
.modal {
  width: 40vw;
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

  &-gi {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-top {
    height: 56px;
    margin-top: 8px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
  }

  &-porperty {
    font-weight: 400;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 17px;
    text-align: left;
    font-style: normal;
    margin-right: 36px;
    width: 50px;
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
}

::v-deep(.n-input-wrapper) {
  background-color: #{$--color-dark-modal-content};
}

::v-deep(.n-input__input-el) {
  border-bottom: 1px solid #{$--color-dark-modal-title};
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
