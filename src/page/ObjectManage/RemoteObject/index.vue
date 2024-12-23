<template>
  <div class="project">
    <div class="project-card">
      <div class="project-card-top">
        <div class="project-card-top-title">{{ $t('device.object_list') }}</div>
      </div>
      <div class="project-card-content">
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
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { icon } from '@/plugins'
import { NButton, NIcon } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

const t = window['$t']

const { DeleteIcon, EditIcon } = icon.carbon

const data = ref<any[]>([])
const height = ref(500)

function createColumns(): DataTableColumns<any> {
  return [
    {
      title: () => t('device.name'),
      key: 'name'
    },
    {
      title: () => t('device.modbus_link'),
      key: 'modbus_id',
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
    }

    &-content {
      padding: 0 16px;
    }
  }
}
</style>
