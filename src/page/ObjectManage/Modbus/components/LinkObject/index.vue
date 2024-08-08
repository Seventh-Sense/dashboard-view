<template>
  <div>
    <div class="add-btn">
      <n-button type="info" @click="add">ADD</n-button>
    </div>
    <n-data-table :columns="columns" :data="data" :bordered="false" />
    <n-modal
      v-model:show="showModal"
      :mask-closable="false"
      preset="card"
      :style="{ width: '600px' }"
      title="配置"
      :bordered="false"
    >
      <div>
        <div class="tip-title">Link:</div>
        <n-select
          v-model:value="selectedRow.modbus_id"
          size="small"
          placeholder="Select"
          :options="linkOptions"
        />
        <div class="tip-title">Name:</div>
        <n-input v-model:value="selectedRow.name" size="small" type="text" />
        <div class="tip-title">Slave ID:</div>
        <n-input-number v-model:value="selectedRow.slaveid" size="small" clearable />
        <div class="tip-title">Register address:</div>
        <n-input-number v-model:value="selectedRow.addr" size="small" clearable />
        <div class="tip-title">Data Value:</div>
        <n-input v-model:value="selectedRow.value" size="small" type="text" />
      </div>
      <template #footer>
        <div class="modal-footer">
          <n-button @click="onNegativeClick">取消</n-button>
          <n-button type="info" @click="onPositiveClick">确认</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted } from 'vue'
import { NButton } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { deletePoint, readPoints, updatePoint, writePoint } from '@/api/http'

const isEdit = ref(false)
const data = ref<any[]>([])

const linkOptions = [
  {
    label: '/dev/ttyS3',
    value: 1
  },
  {
    label: '/dev/ttyS4',
    value: 2
  }
]
const selectedRow = ref({
  id: '',
  modbus_id: 1,
  name: '',
  slaveid: 0,
  addr: 0,
  value: ''
})

function createColumns(): DataTableColumns<any> {
  return [
    {
      title: 'Link',
      key: 'modbus_id',
      render(row) {
        return row.modbus_id === 1 ? '/dev/ttyS3' : '/dev/ttyS4'
      }
    },
    {
      title: 'Name',
      key: 'name'
    },
    {
      title: 'Slave ID',
      key: 'slaveid'
    },
    {
      title: 'Register address',
      key: 'addr'
    },
    {
      title: 'Data Value',
      key: 'value'
    },

    {
      title: 'Action',
      key: 'actions',
      render(row) {
        return h('div', {}, [
          h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',

              onClick: () => {
                isEdit.value = true
                showModal.value = true
                selectedRow.value = row
              }
            },
            { default: () => 'Edit' }
          ),
          h(
            'span',
            {
              style: {
                marginRight: '20px'
              }
            },
            ''
          ),
          h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              onClick: () => {
                deleteRow(row)
              }
            },
            { default: () => 'Delete' }
          )
        ])
      }
    }
  ]
}
const columns = ref(createColumns())

const showModal = ref(false)

onMounted(() => {
  initData()
})

const initData = () => {
  readPoints()
    .then((res: any) => {
      if (res.length !== 0) {
        data.value = res
      }
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
}

const onPositiveClick = () => {
  if (paramCheck()) {
    if (isEdit.value) {
      updatePoint(selectedRow.value.id, selectedRow.value)
        .then(res => {
          window['$message'].success('Update Success!')
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          clear()
          showModal.value = false
          isEdit.value = false
        })
    } else {
      writePoint(selectedRow.value)
        .then(res => {
          data.value.push(res)
          window['$message'].success('Create Success!')
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          clear()
          showModal.value = false
        })
    }
  }
}

const paramCheck = () => {
  let flag = true

  if (selectedRow.value.name === '') {
    flag = false
    window['$message'].error('Object name is not filled in!')
  }

  return flag
}

const onNegativeClick = () => {
  clear()
  showModal.value = false
  isEdit.value = false
}

const add = () => {
  showModal.value = true
}

const deleteRow = (row: any) => {
  deletePoint(row.id)
    .then((res: any) => {
      data.value = data.value.filter((item: any) => item.id !== row.id)
    })
    .catch(err => {
      console.log(err)
    })
}

const clear = () => {
  selectedRow.value = {
    id: '',
    modbus_id: 1,
    name: '',
    slaveid: 0,
    addr: 0,
    value: ''
  }
}

//sort
const sortLists = (list: any[]) => {
  let i = 1
  list &&
    list.forEach(item => {
      item.no = i++
    })

  return list
}
</script>

<style lang="scss" scoped>
.modal-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.tip-title {
  margin-top: 6px;
  margin-bottom: 8px;
}

.add-btn {
  margin-bottom: 12px;
}

.save-btn {
  height: 48px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
