<template>
  <div class="project">
    <div class="project-card">
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
      <div class="project-card-content">
        <n-data-table
          size="small"
          :columns="columns"
          :data="data"
          :bordered="false"
          :row-class-name="(rowData: object, index : number) => rowClassName(rowData, index)"
        />
        <n-modal v-model:show="showModal">
          <n-card
            :bordered="true"
            role="dialog"
            aria-modal="true"
            size="small"
            :mask-closable="false"
            style="width: 600px; background: rgba(0, 0, 0, 1); border-radius: 18px"
          >
            <template #header>
              <n-space justify="space-between" align="center">
                <span class="project-modal-title">
                  {{ $t('device.config') }}
                </span>
                <n-icon size="32" :depth="1" @click="onNegativeClick" style="cursor: pointer">
                  <CloseOutlineIcon />
                </n-icon>
              </n-space>
            </template>
            <div class="project-modal">
              <div class="project-modal-tip" style="margin-top: 0">
                {{ $t('device.modbus_link') }}:
              </div>
              <n-select
                v-model:value="selectedRow.modbus_id"
                placeholder="Select"
                :options="linkOptions"
              />
              <div class="project-modal-tip">{{ $t('device.name') }}:</div>
              <n-input v-model:value="selectedRow.name" type="text" />
              <div class="project-modal-tip">Slave ID:</div>
              <n-input-number v-model:value="selectedRow.slaveid" clearable />
              <div class="project-modal-tip">{{ $t('device.reg_attr') }}:</div>
              <n-input-number v-model:value="selectedRow.addr" clearable />
              <div class="project-modal-tip">{{ $t('device.value') }}:</div>
              <n-input v-model:value="selectedRow.value" type="text" />
            </div>
            <template #footer>
              <n-space justify="end">
                <n-button @click="onPositiveClick">{{ $t('global.r_ok') }}</n-button>
              </n-space>
            </template>
          </n-card>
        </n-modal>
        <n-modal v-model:show="showConfigModal">
          <n-card
            :bordered="true"
            role="dialog"
            aria-modal="true"
            size="small"
            :mask-closable="false"
            style="width: 864px; background: rgba(0, 0, 0, 1); border-radius: 18px"
          >
            <template #header>
              <n-space justify="space-between" align="center">
                <span class="project-modal-title">设置Modbus</span>
                <n-icon size="32" :depth="1" @click="onConfigClose" style="cursor: pointer">
                  <CloseOutlineIcon />
                </n-icon>
              </n-space>
            </template>
            <div class="project-modal-config-title">Modbus1</div>
            <LinkParams :data="configData.modbus1" />
            <div class="project-modal-config-title">Modbus2</div>
            <LinkParams :data="configData.modbus2" />
            <template #footer>
              <n-space justify="end">
                <n-button @click="onConfigSave">{{ $t('global.r_ok') }}</n-button>
              </n-space>
            </template>
          </n-card>
        </n-modal>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h, onMounted, watch } from 'vue'
import { NButton, NIcon } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import {
  deletePoint,
  readPoints,
  updatePoint,
  writePoint,
  createModbusConfig,
  readModbusConfig,
  writeModbusConfig
} from '@/api/http'
import { icon } from '@/plugins'
import { LinkParams } from './components/LinkParams'

interface RowData {
  id: number
  modbus_id: number
  name: string
  slaveid: number
  addr: number
  value: string
}

const isEdit = ref(false)
const data = ref<any[]>([])
const showModal = ref(false)
const showConfigModal = ref(false)
const { SettingsOutlineIcon, CloseOutlineIcon } = icon.ionicons5
const { DeleteIcon, EditIcon } = icon.carbon

const t = window['$t']

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
const selectedRow = ref<RowData>({
  id: 0,
  modbus_id: 1,
  name: '',
  slaveid: 0,
  addr: 0,
  value: ''
})

function createColumns(): DataTableColumns<any> {
  return [
    {
      title: () => t('device.modbus_link'),
      key: 'modbus_id',
      render(row) {
        return row.modbus_id === 1 ? '/dev/ttyS3' : '/dev/ttyS4'
      }
    },
    {
      title: () => t('device.name'),
      key: 'name'
    },
    {
      title: 'Slave ID',
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
                  showModal.value = true
                  selectedRow.value = row
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

const rowClassName = (row: object, index: number) => {
  return index % 2 === 0 ? 'td-odd' : 'td-even'
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

const onNegativeClick = () => {
  clear()
  showModal.value = false
  isEdit.value = false
}

const paramCheck = () => {
  let flag = true

  if (selectedRow.value.name === '') {
    flag = false
    window['$message'].error('Object name is not filled in!')
  }

  return flag
}

const clear = () => {
  selectedRow.value = {
    id: 0,
    modbus_id: 1,
    name: '',
    slaveid: 0,
    addr: 0,
    value: ''
  }
}

//config
const configData = reactive({
  modbus1: {
    id: '1',
    connect_mode: 'Serial Port',
    serial_port: '/dev/ttyS3',
    baudrate: 9600,
    data_bit: 8,
    parity: 'Even',
    stop_bit: 2,
    mode: 'RTU'
  },
  modbus2: {
    id: '2',
    connect_mode: 'Serial Port',
    serial_port: '/dev/ttyS4',
    baudrate: 9600,
    data_bit: 8,
    parity: 'Even',
    stop_bit: 2,
    mode: 'RTU'
  }
})
const onConfigOpen = () => {
  showConfigModal.value = true
}
const onConfigClose = () => {
  showConfigModal.value = false
}

const onConfigSave = () => {
  // save Modbus 1
  writeModbusConfig(1, {
    name: 'Modbus 1',
    settings: JSON.stringify(configData.modbus1)
  }).then(res => {
    console.log('modification Modbus 1 success')
  }).catch(err => {
    console.log(err)
  })

  writeModbusConfig(2, {
    name: 'Modbus 2',
    settings: JSON.stringify(configData.modbus2)
  }).then(res => {
    console.log('modification Modbus 2 success')
    window['$message'].success('Data modification Success!')
  }).catch(err => {
    console.log(err)
  })

  showConfigModal.value = false
}

watch(
  () => showConfigModal.value,
  (newValue: boolean) => {
    if (newValue) {
      readModbusConfig()
        .then((res: any) => {
          let result = res.find((item: any) => item.name === 'Modbus 1')
          if (result === undefined) {
            initCreate('Modbus 1', configData.modbus1)
          } else {
            updateData('Modbus 1', result)
          }

          let result2 = res.find((item: any) => item.name === 'Modbus 2')
          if (result2 === undefined) {
            initCreate('Modbus 2', configData.modbus2)
          } else {
            updateData('Modbus 2', result2)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
)

const initCreate = (name: string, data: Object) => {
  createModbusConfig({
    name: name,
    settings: JSON.stringify(data)
  })
    .then((res: any) => {
      console.log('create' + name + 'success')
    })
    .catch(err => {
      console.log(err)
    })
}

const updateData = (name: string, res: any) => {
  let result = JSON.parse(res.settings)

  if (name === 'Modbus 1') {
    configData.modbus1 = result
  }

  if (name === 'Modbus 2') {
    configData.modbus2 = result
  }

  console.log(data)
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

// :deep(.td-odd td) {
//   font-size: 14px;
//   color: #{$--color-dark-font};
//   background-color: #{$--color-dark-table-odd};
//   backdrop-filter: blur(30px);
// }

// :deep(.td-even td) {
//   font-size: 14px;
//   color: #{$--color-dark-font};
//   background-color: transparent;
//   backdrop-filter: blur(30px);
// }
</style>
