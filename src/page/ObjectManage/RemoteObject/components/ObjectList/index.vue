<template>
  <div>
    <n-space class="top" justify="space-between" align="center">
      <n-space>
        <n-icon size="20" class="top-icon" @click="onBack">
          <ChevronBackOutlineIcon />
        </n-icon>
        <span class="top-title">{{ $t('device.object_list') }}</span>
      </n-space>
      <div class="content-button content-button-color1" @click="onSearch">
        {{ $t('global.r_add') }}
      </div>
    </n-space>

    <div class="content">
      <div class="content-filter">
        <div>
          <div class="content-title">设备</div>
          <n-select
            v-model:value="selectDevice"
            placeholder="Select"
            :options="data"
            style="width: 200px"
          />
        </div>
        <div>
          <div class="content-title">过滤器</div>
          <n-input v-model:value="filterString" type="text" style="width: 366px" />
        </div>

        <div class="content-button content-button-color2" @click="onReset">
          {{ $t('device.reset') }}
        </div>

        <div class="content-button content-button-color1" @click="onSearch">
          {{ $t('device.search') }}
        </div>
      </div>
      <a-table
        class="ant-table-striped"
        size="middle"
        :columns="columns"
        :data-source="data"
        :scroll="{ y: height - 44 }"
        :pagination="false"
        :row-class-name="(_record: any, index: any) => (index % 2 === 1 ? 'table-striped1' : 'table-striped2')"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'actions'">
            <img
              width="24"
              height="24"
              :src="SVG_ICON.card_icons.edit"
              style="cursor: pointer; margin-right: 40px"
              @click="onEdit(record)"
            />
            <img
              width="24"
              height="24"
              :src="SVG_ICON.card_icons.delete_red"
              style="cursor: pointer"
              @click="deleteRow(record)"
            />
          </template>
        </template>
      </a-table>
      <ObjectSetModal :isShowModal="isShowModal"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { icon } from '@/plugins'
import { ref, onMounted } from 'vue'
import { tagDataType } from '../../utils/utils'
import { NButton, NIcon } from 'naive-ui'
import SVG_ICON from '@/svg/SVG_ICON'
import { ObjectSetModal } from '../../modal/ObjectSetModal'

const { ChevronBackOutlineIcon } = icon.ionicons5

const emit = defineEmits(['goback'])
const t = window['$t']
const isShowModal = ref(false)

const height = ref(Number(document.documentElement.clientHeight) - 80 - 32 - 72 - 90)

const selectDevice = ref('')
const filterString = ref('')
const data = ref<tagDataType[]>([])

const columns = [
  { title: () => t('device.name'), dataIndex: 'name' },
  { title: () => t('device.polling'), dataIndex: 'device' },
  { title: () => t('device.address'), dataIndex: 'address' },
  { title: () => t('device.type'), dataIndex: 'type' },
  { title: () => t('device.value'), dataIndex: 'value' },
  { title: '', dataIndex: 'actions', width: 120 }
]

onMounted(() => {
  console.log('aaaaaaaaaaaaaaaaa')
  initData()
})

const initData = () => {
  for (let index = 0; index < 100; index++) {
    data.value.push({
      id: index.toString(),
      name: 'device' + index,
      device: 'device' + index,
      address: 'address' + index,
      type: 'type' + index,
      value: 'value' + index
    })
  }
}

const onSearch = (row: any) => {}

const onReset = (row: any) => {}

const onEdit = (row: any) => {}

const deleteRow = (row: any) => {
  data.value = data.value.filter((item: any) => item.id !== row.id)
}

const onBack = () => {
  // Navigate back to the previous page
  emit('goback')
}
</script>

<style lang="scss" scoped>
.top {
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

  &-icon {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.content {
  padding: 0 16px;

  &-title {
    font-weight: 400;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 0px;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }

  &-filter {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    gap: 24px;
    margin-bottom: 12px;
    padding-left: 12px;
    height: 60px;
  }

  &-button {
    width: 64px;
    height: 32px;
    border-radius: 2px;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &-color1 {
      background-color: #{$--color-dark-button1};
    }

    &-color2 {
      background-color: #{$--color-dark-button2};
      border: 1px solid #{$--color-dark-button2-border};
    }
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
::v-deep(.n-input) {
  background: transparent;
}
::v-deep(.n-input--focus) {
  background: transparent !important;
}

::v-deep(.n-input__input-el) {
  border-bottom: 1px solid #{$--color-dark-modal-title};
}

::v-deep(.n-select) {
  border-bottom: 1px solid #{$--color-dark-modal-title};
}

::v-deep(.n-base-selection) {
  --n-border: 0 !important;
  --n-border-active: 0 !important;
  --n-border-hover: 0 !important;
  --n-border-focus: 0 !important;
  --n-box-shadow-active: 0 !important;
  --n-box-shadow-focus: 0 !important;
  --n-color-active: transparent !important;
  --n-color-disabled: transparent !important;
  --n-padding-single: 0 26px 0 0 !important;
}

::v-deep(.n-base-selection-label) {
  background: transparent;
}
</style>
