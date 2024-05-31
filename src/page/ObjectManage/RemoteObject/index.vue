<template>
  <div class="remote-container">
    
    <div class="remote-operate">
      <n-card :title="$t('device.device_list')">
      <div>
        <n-space>
          <span>{{ $t('device.link_type') }}</span>
          <n-select
            v-model:value="selectParam.link_type"
            :options="linkOptions"
            size="small"
            style="width: 200px"
          />
        </n-space>
      </div>
      <div class="remote-operate-btn">
        <n-space>
          <n-button type="tertiary">{{ $t('device.reset') }}</n-button>
          <n-button type="success">{{ $t('device.search') }}</n-button>
        </n-space>
      </div>
    </n-card>
    </div>
    <div class="remote-list">
      <n-card :title="$t('device.device_list')">
        <n-data-table :columns="columns" :data="data" :pagination="false" :bordered="false" />
      </n-card>
      <div>
        <!-- 抽屉 -->
        <n-drawer
          v-model:show="active"
          :default-width="1200"
          :placement="placement"
          :mask-closable="false"
          :resizable="true"
        >
          <n-drawer-content>
            <template #header>
              <n-space>
                <n-icon size="24" :depth="1" style="cursor: pointer;" @click="onDrawerClose">
                  <ArrowBackIcon />
                </n-icon>
                <span style="line-height: 24px;">{{ $t('device.device_info') }}</span>
              </n-space>
            </template>
            <ObjectDisplay />
          </n-drawer-content>
        </n-drawer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h, reactive, provide } from 'vue'
import type { DataTableColumns, DrawerPlacement } from 'naive-ui'
import { NButton, useMessage } from 'naive-ui'
import { linkOptions } from '../../untils/options'
import { ObjectDisplay } from '@/page/ObjectManage/RemoteObject/components/ObjectDisplay'
import { icon } from '@/plugins'
import { DeviceList } from '@/page/untils/type'

const { ArrowBackIcon } = icon.ionicons5
const message = useMessage()
const t = window['$t']

//点击的设备行
const selectRow = ref({});

provide('deviceInfo', selectRow)

//filter
const selectParam = reactive({
  link_type: '1'
})

// drawer
const active = ref(false)
const placement = ref<DrawerPlacement>('right')

const activate = (place: DrawerPlacement) => {
  active.value = true
  placement.value = place
}

const onDrawerClose = () => {
  active.value = false
  selectRow.value = {}
}

const createColumns = ({
  play
}: {
  play: (row: DeviceList) => void
}): DataTableColumns<DeviceList> => {
  return [
    {
      title: () => t('device.no'),
      key: 'no'
    },
    {
      title: () => t('device.device_name'),
      key: 'device_name'
    },
    {
      title: () => t('device.link_type'),
      key: 'link_type'
    },
    {
      title: () => t('device.status'),
      key: 'status'
    },
    {
      title: () => t('device.operations'),
      key: 'actions',
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            quaternary: true,
            size: 'small',
            onClick: () => play(row)
          },
          { default: () => t('device.detail') }
        )
      },
      width: 100,
      fixed: 'right'
    }
  ]
}

const columns = createColumns({
  play(row: DeviceList) {
    //message.info(`Play ${row.title}`)
    activate('right')
    selectRow.value = row
  }
})

const data: DeviceList[] = [
  {
    no: 3,
    device_name: 'Wonderwall',
    link_type: '4:188888888888888888888888888888888',
    status: '1999999999999999999999999999'
  },
  { no: 4, device_name: "Don't Look Back in Anger", link_type: '4:48', status: '1' },
  { no: 12, device_name: 'Champagne Supernova', link_type: '7:27', status: '1' }
]
</script>

<style lang="scss" scoped>
.remote-container {
  padding: 12px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 56px - 32px - 12px - 12px);

  .remote-operate {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 200px;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    border-radius: 4px;

    .remote-operate-btn {
      height: 40px;
      padding: 4px 12px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }

  .remote-list {
    margin-top: 12px;
    flex-grow: 1;
    height: 100%;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    border-radius: 4px;

  }
}


::v-deep(.n-drawer-body-content-wrapper) {
  padding: 0 24px !important;
}
</style>
