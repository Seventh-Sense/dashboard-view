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
        <n-grid x-gap="32" :cols="2">
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
        <div class="modal-filter">
          <n-input
            v-model:value="keyword"
            clearable
            style="width: 366px"
          />
        </div>
        <n-data-table
          :columns="columns"
          :bordered="false"
          :data="filteredData"
          :max-height="450"
          :loading="loading"
          :row-key="(row: DataType) => row.key"
          virtual-scroll
          @update:checked-row-keys="handleCheck"
        />
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
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'

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

// 搜索关键字
const keyword = ref('')

const filteredData = computed(() => {
  if (keyword.value === '') return data.value

  const searchTerm = keyword.value.toLowerCase()

  return data.value.filter(item => {
    return Object.values(item).some(value => {
      return String(value).toLowerCase().includes(searchTerm)
    })
  })
})

const columns: DataTableColumns<DataType> = [
  {
    type: 'selection',
    disabled(row: DataType) {
      return row.disabled === true
    }
  },
  {
    title: () => t('device.object_name'),
    key: 'name',
    sorter: 'default'
  },
  {
    title: () => t('device.type'),
    key: 'type',
    render(row, index) {
      return DEVICE_TYPE_MAP[row.type]
    },
    sorter: 'default'
  },
  {
    title: () => t('device.id'),
    key: 'id',
    sorter: (row1, row2) => parseInt(row1.id) - parseInt(row2.id)
  }
]

const selectedObjKeys = ref<string[]>([])

const checkedRowKeysRef = ref<DataTableRowKey[]>([])

const handleCheck = (rowKeys: DataTableRowKey[]) => {
  //console.log('checkedRowKeysRef', rowKeys)
  checkedRowKeysRef.value = rowKeys
}

onMounted(() => {
  fetchData()
  //init()
})

const init = () => {
  loading.value = true
  for (let i = 1; i < 3000; i++) {
    data.value.push({
      key: i.toString(),
      name: '2',
      type: 2,
      id: i.toString(),
      disabled: false
    })
  }
  loading.value = false
}

onUnmounted(() => {
  selectedObjKeys.value = []
  checkedRowKeysRef.value = []
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
      window['$message'].warning(res.data)
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

  const mergedKeysSet = new Set([...checkedRowKeysRef.value, ...newKeys])
  console.log('mergedKeysSet', mergedKeysSet)

  checkedRowKeysRef.value = Array.from(mergedKeysSet)

  // 处理并返回结果数据
  return resData
    .filter(([typeNum]) => ![8, 15, 17, 20, 23, 56].includes(typeNum)) // 过滤无效类型
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
  if (checkedRowKeysRef.value.length === 0) {
    return
  }

  loadingButton.value = true
  //console.log('selectedRowKeys', selectedRowKeys.value)
  //剔除已经选中过的点位
  const list = checkedRowKeysRef.value
    .map(key => {
      if (selectedObjKeys.value.includes(String(key))) return null // 跳过已选中的点位

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

  //console.log('list', list)

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

const onSearch = () => {
  console.log(typeof keyword.value, keyword.value)
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
    justify-content: flex-start;
    align-items: center;
  }

  &-top {
    height: 56px;
    margin-top: 8px;
    margin-bottom: 16px;
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
    width: 64px;
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

  &-filter {
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
    margin-bottom: 10px;
  }
}

// ::v-deep(.n-input-wrapper) {
//   background-color: #{$--color-dark-modal-content};
// }

::v-deep(.n-input__input-el) {
  padding-left: 8px;
  //border-bottom: 1px solid #{$--color-dark-modal-title};
}

::v-deep(.n-input__placeholder) {
  padding-left: 8px;
}

::v-deep(.n-base-clear) {
  margin-right: 12px;
}

::v-deep(.n-input--focus) {
  background-color: rgba(255, 255, 255, 0.1) !important;
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

::v-deep(.n-checkbox--disabled .check-icon) {
  opacity: 1 !important;
  transform: scale(1) !important;
}
</style>
