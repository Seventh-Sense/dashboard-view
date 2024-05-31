<template>
  <div>
    <n-data-table :columns="columns" :data="data" :pagination="false" :bordered="false" />
    <n-drawer
      v-model:show="o_active"
      :default-width="1200"
      :placement="placement"
      :mask-closable="false"
      :resizable="true"
    >
      <n-drawer-content>
        <template #header>
          <n-space>
            <n-icon size="24" :depth="1" style="cursor: pointer" @click="onDrawerClose">
              <ArrowBackIcon />
            </n-icon>
            <span style="line-height: 24px">{{ $t('device.object_info') }}</span>
          </n-space>
        </template>
        <ObjectInfo/>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { ObjectList } from '@/page/untils/type'
import type { DataTableColumns, DrawerPlacement } from 'naive-ui'
import { ref, h, reactive, provide } from 'vue'
import { NButton, useMessage } from 'naive-ui'
import { icon } from '@/plugins'
import { ObjectInfo } from '@/page/ObjectManage/RemoteObject/components/ObjectInfo'

const t = window['$t']
const { ArrowBackIcon } = icon.ionicons5

//点击的对象行
const selectRow = ref({})

// drawer
const o_active = ref(false)
const placement = ref<DrawerPlacement>('right')
const activate = (place: DrawerPlacement) => {
    o_active.value = true
  placement.value = place
}

const onDrawerClose = () => {
    o_active.value = false
  selectRow.value = {}
}

const createColumns = ({
  play
}: {
  play: (row: ObjectList) => void
}): DataTableColumns<ObjectList> => {
  return [
    {
      title: () => t('device.no'),
      key: 'no'
    },
    {
      title: () => t('device.object_name'),
      key: 'object_name'
    },
    {
      title: () => t('device.b_device'),
      key: 'device_name'
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
  play(row: ObjectList) {
    //message.info(`Play ${row.title}`)
    activate('right')
    selectRow.value = row
  }
})

const data: ObjectList[] = [
  {
    no: 3,
    object_name: 'Wonderwall',
    device_name: '4888888',
    status: 'Wonderwall'
  },
  { no: 4, object_name: "Don't Look Back in Anger", device_name: '4:48', status: '1' },
  { no: 12, object_name: 'Champagne Supernova', device_name: '7:27', status: '1' }
]
</script>

<style lang="scss" scoped>
::v-deep(.n-drawer-body-content-wrapper) {
  padding: 0 24px !important;
}

</style>
