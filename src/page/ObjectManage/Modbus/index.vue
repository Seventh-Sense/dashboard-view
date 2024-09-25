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
        <ModbusModal
          v-model:showModal="showModal"
          :data="selectedRow"
          :options="linkOptions"
          :isEdit="isEdit"
        />

        <n-modal v-model:show="showConfigModal" :mask-closable="false">
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
                <n-space :size="[1, 0]">
                  <n-icon size="32" :depth="1" @click="onConfigClose" style="cursor: pointer">
                    <ChevronBackOutlineIcon />
                  </n-icon>
                  <span class="project-modal-title">设置Modbus</span>
                </n-space>

                <n-icon
                  v-if="!isConfigEdit"
                  size="24"
                  :depth="1"
                  @click="onEdit"
                  style="cursor: pointer"
                >
                  <EditIcon />
                </n-icon>
                <n-icon
                  v-else
                  size="24"
                  :depth="1"
                  @click="onEdit"
                  style="background: rgba(102, 102, 255, 1); cursor: pointer"
                >
                  <EditIcon />
                </n-icon>
              </n-space>
            </template>
            <div style="height: 500px; overflow-y: auto">
              <n-collapse>
                <template #header-extra>
                  <div
                    style="
                      width: 44px;
                      height: 44px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <img width="24" height="24" :src="SVG_ICON.card_icons.expand" />
                  </div>
                </template>
                <template #arrow>
                  <div></div>
                </template>
                <n-collapse-item v-for="config in configData" :name="config.name">
                  <template #header>
                    <img
                      v-if="isConfigEdit"
                      width="24"
                      height="24"
                      @click.stop="onDelete(config.id)"
                      :src="SVG_ICON.card_icons.delete"
                    />
                    <img width="24" height="24" :src="SVG_ICON.card_icons.separator" />

                    <n-space v-if="isConfigEdit" @click.stop align="center">
                      <n-input
                        v-model:value="config.name"
                        type="text"
                        size="small"
                        style="width: 150px"
                      />
                      <n-icon size="20" :depth="1" @click="onCheck(config)" style="cursor: pointer">
                        <CheckmarkIcon />
                      </n-icon>
                    </n-space>
                    <span v-else>{{ config.name }}</span>
                  </template>
                  <LinkParams :data="config" :options="serialOptions" />
                  <n-space justify="end">
                    <n-button @click="onConfigSave(config)">{{ $t('global.r_ok') }}</n-button>
                  </n-space>
                </n-collapse-item>
              </n-collapse>
              <div class="project-modal-block" @click="onAdd">
                <img width="24" height="24" :src="SVG_ICON.card_icons.add" />
                <span style="margin-left: 8px; font-size: 14px; color: rgba(255, 255, 255, 0.93)">
                  新增
                </span>
              </div>
            </div>

            <template #footer>
              <!-- <n-space justify="end">
                <n-button @click="onConfigSave">{{ $t('global.r_ok') }}</n-button>
              </n-space> -->
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
  writeModbusConfig,
  delModbusConfig,
  readComs
} from '@/api/http'
import { icon } from '@/plugins'
import { LinkParams } from './components/LinkParams'
import SVG_ICON from '@/svg/SVG_ICON'
import { ModbusModal } from './modal/ModbusModal'

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
}

const isEdit = ref(false)
const data = ref<any[]>([])
const showModal = ref(false)
const showConfigModal = ref(false)
const { SettingsOutlineIcon, CloseOutlineIcon, ChevronBackOutlineIcon, CheckmarkIcon } =
  icon.ionicons5
const { DeleteIcon, EditIcon } = icon.carbon

const t = window['$t']

const linkOptions = ref<any>([])
const selectedRow = ref<RowData>({
  id: 0,
  modbus_id: '',
  name: '',
  slaveid: 0,
  addr: 0,
  code_seq: 'AB',
  gain: 0.1,
  data_type: '16int',
  reg_type: 'Input Registers',
  unit: '',
  value: ''
})

const clear = () => {
  selectedRow.value = {
    id: 0,
    modbus_id: '',
    name: '',
    slaveid: 0,
    addr: 0,
    code_seq: 'AB',
    gain: 0.1,
    data_type: '16int',
    reg_type: 'Input Registers',
    unit: '',
    value: ''
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
      title: 'Slave ID',
      key: 'slaveid'
    },
    {
      title: () => t('device.reg_attr'),
      key: 'addr'
    },
    {
      title: () => t('device.unit'),
      key: 'unit'
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

  updateLinks()
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

const rowClassName = (row: object, index: number) => {
  return index % 2 === 0 ? 'td-odd' : 'td-even'
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
      updateLinks()
    } else {
      clear()
      initData()
    }
  }
)

//config
const configData = ref<any>([])
const isConfigEdit = ref(false)
const serialOptions = ref([])

const onAdd = () => {
  if (!isConfigEdit.value) {
    let id =
      configData.value.length === 0 ? 1 : configData.value[configData.value.length - 1].id + 1

    let data = {
      name: 'Modbus' + id,
      id: id,
      connect_mode: 'Serial Port',
      serial_port: '',
      baudrate: 115200,
      data_bit: 8,
      parity: 'None',
      stop_bit: 1,
      mode: 'RTU'
    }

    createModbusConfig({
      name: data.name,
      settings: JSON.stringify(data)
    })
      .then((res: any) => {
        console.log('create' + data.name + 'success')
        configData.value.push(data)
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    window['$message'].warning('请退出编辑模式!')
  }
}

const onEdit = () => {
  isConfigEdit.value = !isConfigEdit.value
}
const onDelete = (id: any) => {
  delModbusConfig(id)
    .then((res: any) => {
      if (res.ok) {
        configData.value = configData.value.filter((item: any) => item.id !== id)
        window['$message'].success('数据删除成功!')
      }
    })
    .catch(err => {
      console.log(err)
    })
}
const onConfigOpen = () => {
  showConfigModal.value = true
}
const onConfigClose = () => {
  if (!isConfigEdit.value) {
    showConfigModal.value = false
  } else {
    window['$message'].warning('请退出编辑模式!')
  }
}

const onConfigSave = (data: any) => {
  // save Modbus
  writeModbusConfig(data.id, {
    name: data.name,
    settings: JSON.stringify(data)
  })
    .then(res => {
      window['$message'].success('数据修改成功!')
    })
    .catch(err => {
      console.log(err)
    })
}

//修改名字
const onCheck = (data: any) => {
  writeModbusConfig(data.id, {
    name: data.name,
    settings: JSON.stringify(data)
  })
    .then(res => {
      window['$message'].success('数据修改成功!')
      updateLinks()
    })
    .catch(err => {
      console.log(err)
    })
}

watch(
  () => showConfigModal.value,
  (newValue: boolean) => {
    if (newValue) {
      configData.value = []
      readModbusConfig()
        .then((res: any) => {
          if (res.length > 0) {
            res.forEach((item: any) => {
              let result = JSON.parse(item.settings)
              result.id = item.id
              configData.value.push(result)
            })
          }
        })
        .catch(err => {
          console.log(err)
        })

      readComs()
        .then((res: any) => {
          if (res.status === 'OK') {
            serialOptions.value = res.ports.map((v: any) => ({
              label: v,
              value: v
            }))
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
)
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

    &-block {
      height: 44px;
      width: calc(100% - 10px);
      border-radius: 8px;
      background-color: #201e2b;
      backdrop-filter: blur(30px);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      margin-top: 16px;
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

:deep(.n-collapse-item__header) {
  height: 44px;
  width: 100%;
  background-color: #201e2b;
  backdrop-filter: blur(30px);
  border-radius: 8px;
  padding: 0 !important;
}

:deep(.n-collapse) {
  padding-right: 10px;
}
</style>
