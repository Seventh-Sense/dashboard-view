<template>
  <div>
    <div class="top">
      <n-space justify="start" align="center">
        <n-icon size="20" class="top-icon" @click="onBack">
          <ArrowBackOutlineIcon />
        </n-icon>
        <span class="top-title">{{ $t('device.object_list') }}</span>
      </n-space>
    </div>
    <div class="content">
      <n-data-table
          size="small"
          :columns="columns"
          :data="data"
          :bordered="false"
          :style="{ height: `${height}px` }"
          flex-height
        />
    </div>
  </div>
</template>

<script setup lang="ts">
import { icon } from '@/plugins'
import { ref, h } from 'vue'
import { tagDataType } from '../../utils/utils'
import type { DataTableColumns } from 'naive-ui'
import { NButton, NIcon } from 'naive-ui'

const { ArrowBackOutlineIcon } = icon.ionicons5
const { DeleteIcon, EditIcon, StoreIcon, AddFilledIcon } = icon.carbon


const emit = defineEmits(['goback'])
const t = window['$t']

const height = ref(500)

const data = ref<tagDataType[]>([
  {
    name: 'string',
    device: 'string',
    address: 'string',
    type: 'string',
    value: 'string',
    timestamp: 'true',
    description: 'true',
  }
])
function createColumns(): DataTableColumns<tagDataType> {
  return [
    {
      title: () => t('device.name'),
      key: 'name'
    },
    {
      title: () => t('device.type'),
      key: 'device'
    },
    {
      title: () => t('device.polling'),
      key: 'address'
    },
    {
      title: () => t('device.address'),
      key: 'type'
    },
    {
      title: () => t('device.status'),
      key: 'value'
    },
    {
      title: () => t('device.enabled'),
      key: 'timestamp'
    },
    {
      title: () => t('device.enabled'),
      key: 'description'
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
                  // isEdit.value = true
                  // selectedRow.value = row
                  // showModal.value = true
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
                  //deleteRow(row)
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
    font-family: Source Han Sans SC, Source Han Sans SC;
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
}
</style>
