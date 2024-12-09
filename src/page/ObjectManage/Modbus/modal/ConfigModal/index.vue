<template>
  <n-modal :show="showModal" :mask-closable="false">
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
          <span class="modal-title">设置Modbus</span>
          <n-icon size="32" :depth="1" @click="onNegativeClick" style="cursor: pointer">
            <CloseOutlineIcon />
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
              <n-space align="center" justify="start">
                <img width="24" height="24" :src="SVG_ICON.card_icons.separator" />
                <n-space v-if="!config.renamed" align="center" justify="start">
                  <span>{{ config.name }}</span>
                  <img
                    width="24"
                    height="24"
                    :src="SVG_ICON.card_icons.edit"
                    @click.stop="onRename(config)"
                  />
                </n-space>
                <n-space v-if="config.renamed" align="center" justify="start">
                  <n-input
                    v-model:value="config.name"
                    type="text"
                    size="small"
                    style="width: 150px"
                  />
                  <img
                    width="24"
                    height="24"
                    :src="SVG_ICON.card_icons.edit"
                    @click.stop="onCheck(config)"
                  />
                </n-space>
                <div v-else style="display: flex;align-items: center;">
                  
                </div>
                <img
                  width="24"
                  height="24"
                  @click.stop="onDelete(config.id)"
                  :src="SVG_ICON.card_icons.delete_one"
                />
              </n-space>
            </template>
            <div style="background: rgba(255, 255, 255, 0.07); border-radius: 8px; padding: 0 18px">
              <n-space justify="end" align="center" style="height: 54px">
                <n-button @click="onConfigSave(config)">{{ $t('global.r_save') }}</n-button>
              </n-space>
              <LinkParams :data="config" :options="serialOptions" />
            </div>
          </n-collapse-item>
        </n-collapse>
        <div class="modal-block" @click="onAdd">
          <img width="24" height="24" :src="SVG_ICON.card_icons.add" />
          <span style="margin-left: 8px; font-size: 14px; color: rgba(255, 255, 255, 0.93)">
            新增
          </span>
        </div>
      </div>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import {
  createModbusConfig,
  delModbusConfig,
  readComs,
  readModbusConfig,
  writeModbusConfig
} from '@/api/http'
import { icon } from '@/plugins'
import SVG_ICON from '@/svg/SVG_ICON'
import { onMounted, ref } from 'vue'
import { LinkParams } from '../../components/LinkParams'

const { CloseOutlineIcon } = icon.ionicons5
const t = window['$t']
let emit = defineEmits(['update:showModal'])
const props = defineProps({
  showModal: {
    type: Boolean,
    required: true
  }
})

const configData = ref<any>([])
const serialOptions = ref([])
const isRename = ref(false)

onMounted(() => {
  configData.value = []
  readModbusConfig()
    .then((res: any) => {
      if (res.length > 0) {
        res.forEach((item: any) => {
          let result = JSON.parse(item.settings)
          result.id = item.id
          result.renamed = false
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
})

const onAdd = () => {
  let id = configData.value.length === 0 ? 1 : configData.value[configData.value.length - 1].id + 1

  let data = {
    name: 'Modbus' + id,
    renamed: false,
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
}
const onNegativeClick = () => {
  emit('update:showModal', false)
}

const onDelete = (id: any) => {
  delModbusConfig(id)
    .then((res: any) => {
      if (res.ok) {
        configData.value = configData.value.filter((item: any) => item.id !== id)
        window['$message'].success(t('msg.modbus_msg_4'))
      }
    })
    .catch(err => {
      console.log(err)
    })
}

const onRename = (data: any) => {
  data.renamed = true
}
//修改名字
const onCheck = (data: any) => {
  writeModbusConfig(data.id, {
    name: data.name,
    settings: JSON.stringify(data)
  })
    .then(res => {
      window['$message'].success(t('msg.modbus_msg_5'))
    })
    .catch(err => {
      console.log(err)
    }).finally(() => {
      data.renamed = false
    })
}

const onConfigSave = (data: any) => {
  // save Modbus
  writeModbusConfig(data.id, {
    name: data.name,
    settings: JSON.stringify(data)
  })
    .then(res => {
      window['$message'].success(t('msg.modbus_msg_5'))
    })
    .catch(err => {
      console.log(err)
    })
}
</script>

<style lang="scss" scoped>
.modal {
  width: 864px;
  background: rgba(0, 0, 0, 1);
  backdrop-filter: blur(50px);
  border-radius: 18px;

  &-title {
    font-size: 20px;
    color: #{$--color-dark-font};
    font-style: normal;
    text-transform: none;
    font-weight: bold;
  }

  &-block {
    height: 52px;
    width: calc(100% - 10px);
    border-radius: 8px;
    background-color: rgba(32, 30, 43, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-top: 16px;
  }
}

:deep(.n-collapse-item) {
  border-radius: 8px;
  background-color: rgba(32, 30, 43, 1);
}

:deep(.n-collapse-item__header) {
  height: 52px;
  width: 100%;
  padding: 0 !important;
}

:deep(.n-collapse) {
  padding-right: 10px;
}

:deep(.n-collapse-item__content-inner) {
  padding-top: 0 !important;
}
</style>
