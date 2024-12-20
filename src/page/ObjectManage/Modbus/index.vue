<template>
  <div class="project">
    <div ref="myDiv" class="project-card">
      <div class="project-card-top">
        <div class="project-card-top-title">{{ $t('device.object_list') }}</div>
        <div class="project-card-top-extra">
          <n-space>
            <n-button quaternary @click="onConfigOpen">
              <n-icon size="20" :depth="1">
                <SettingsOutlineIcon />
              </n-icon>
            </n-button>

            <n-button class="project-card-top-extra-button" @click="add">
              {{ $t('global.r_add') }}
            </n-button>
          </n-space>
        </div>
      </div>
      <div class="project-card-content" >
        <n-data-table
          size="small"
          :columns="columns"
          :data="data"
          :bordered="false"
          :style="{ height: `${height}px` }"
          flex-height
        />
        <ModbusModal
          v-model:showModal="showModal"
          :data="selectedRow"
          :options="linkOptions"
          :isEdit="isEdit"
        />
        <ConfigModal v-model:showModal="showConfigModal" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, h, onMounted, watch } from 'vue'
import { NButton, NIcon } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { deletePoint, readPoints, readModbusConfig } from '@/api/http'
import { icon } from '@/plugins'
import { ModbusModal } from './modal/ModbusModal'
import { ConfigModal } from './modal/ConfigModal'

interface RowData {
  id: number
  modbus_id: any
  name: string
  slaveid: number
  addr: number
  code_seq: string
  gain: number
  data_type: string
  reg_type: string
  unit: string
  value: string
  bacnet_type: string
}

const isEdit = ref(false)
const data = ref<any[]>([])
const showModal = ref(false)
const showConfigModal = ref(false)
const { SettingsOutlineIcon } = icon.ionicons5
const { DeleteIcon, EditIcon } = icon.carbon

const height = ref(500)
const myDiv = ref<any>(null)

const t = window['$t']

const linkOptions = ref<any>([])
const selectedRow = ref<RowData>({
  id: 0,
  modbus_id: '',
  name: '',
  slaveid: 1,
  addr: 0,
  code_seq: 'AB',
  gain: 1,
  data_type: '16int',
  reg_type: '4',
  unit: '',
  value: '',
  bacnet_type: 'None',
})

const clear = () => {
  selectedRow.value = {
    id: 0,
    modbus_id: '',
    name: '',
    slaveid: 1,
    addr: 0,
    code_seq: 'AB',
    gain: 1,
    data_type: '16int',
    reg_type: '4',
    unit: '',
    value: '',
    bacnet_type: 'None',
  }
}

function createColumns(): DataTableColumns<any> {
  return [
    {
      title: () => t('device.name'),
      key: 'name'
    },
    {
      title: () => t('device.modbus_link'),
      key: 'modbus_id',
      render(row) {
        let text = row.modbus_id

        linkOptions.value.forEach((item: any) => {
          if (row.modbus_id === item.value) {
            text = item.label
          }
        })

        return text
      }
    },
    {
      title: () => t('device.slave_id'),
      key: 'slaveid'
    },
    {
      title: () => t('device.reg_attr'),
      key: 'addr'
    },

    {
      title: () => t('device.value'),
      key: 'value'
    },
    {
      title: () => t('device.unit'),
      key: 'unit',
      render(row) {
        let text = row.unit

        if (text === '') {
          text = ' --'
        }
        return text
      }
    },
    {
      title: '',
      key: 'actions',
      render(row) {
        return h(
          'div',
          {
            style: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }
          },
          [
            h(
              NIcon,
              {
                size: '20',
                style: {
                  cursor: 'pointer'
                },
                onClick: () => {
                  isEdit.value = true
                  console.log('aaa',row)
                  selectedRow.value = row
                  showModal.value = true
                }
              },
              { default: () => h(EditIcon) }
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
              NIcon,
              {
                size: '20',
                style: {
                  cursor: 'pointer'
                },
                onClick: () => {
                  deleteRow(row)
                }
              },
              { default: () => h(DeleteIcon) }
            )
          ]
        )
      }
    }
  ]
}
const columns = ref(createColumns())
let interval: number | null = null

onMounted(() => {
  if (myDiv.value) {
    height.value = myDiv.value.offsetHeight - 150
  }
  
  updateLinks()
  initData()
  interval = window.setInterval(() => {
    initData()
  }, 3000)
})

onUnmounted(() => {
  if (interval) {
    window.clearInterval(interval)
  }
})

const initData = () => {
  readPoints()
    .then((res: any) => {
      if (res.length !== 0) {
        data.value = res
      }
      //console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
}

const add = () => {
  isEdit.value = false
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

const updateLinks = () => {
  linkOptions.value = []
  readModbusConfig()
    .then((res: any) => {
      if (res.length > 0) {
        res.forEach((item: any) => {
          let result = JSON.parse(item.settings)
          linkOptions.value.push({
            label: result.name,
            value: item.id
          })
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
}

watch(
  () => showModal.value,
  (newValue: boolean) => {
    if (newValue) {
      //updateLinks()
    } else {
      clear()
      //initData()
    }
  }
)

watch(
  () => showConfigModal.value,
  (newValue: boolean) => {
    if (newValue) {
      //updateLinks()
    } else {
      updateLinks()
    }
  }
)

const onConfigOpen = () => {
  showConfigModal.value = true
}
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

  &-modal {
    &-title {
      font-size: 20px;
      color: #{$--color-dark-font};
      font-style: normal;
      text-transform: none;
      font-weight: bold;
    }

    &-tip {
      font-size: 12px;
      color: #{$--color-dark-modal-title};
      font-style: normal;
      font-weight: 400;
      margin-top: 22px;
      margin-bottom: 14px;
    }

    &-config-title {
      font-size: 16px;
      color: #{$--color-dark-font};
      font-style: normal;
      text-transform: none;
      font-weight: bold;
      margin-bottom: 20px;
    }
  }
}

.s {
  background-color: transparent;
}
</style>
