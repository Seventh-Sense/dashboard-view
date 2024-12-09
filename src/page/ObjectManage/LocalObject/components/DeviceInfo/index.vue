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
          <span class="modal-title">设备详情</span>
          <n-icon size="32" :depth="1" @click="onNegativeClick" style="cursor: pointer">
            <CloseOutlineIcon />
          </n-icon>
        </n-space>
      </template>
      <div v-if="!loading" style="height: 320px; overflow-y: auto; margin-top: 12px">
        <div v-for="item in dataList" :key="item.field_name">
          <div class="modal-name">
            {{ item.field_name }}
          </div>
          <div v-if="!item.edit" class="modal-value">
            {{ item.field_value }}
            <n-icon size="20" @click="onEdit(item)" style="cursor: pointer">
              <EditIcon />
            </n-icon>
          </div>
          <div v-else class="modal-input">
            <n-input v-model:value="item.field_value" size="small"></n-input>
            <div
              style="
                display: flex;
                justify-content: flex-end;
                align-items: center;
                margin-left: 20px;
              "
            >
              <n-icon size="20" @click="onConfrim(item)" style="cursor: pointer">
                <CheckmarkIcon />
              </n-icon>
              <n-icon size="20" @click="onCancel(item)" style="cursor: pointer; margin-left: 12px">
                <CloseIcon />
              </n-icon>
            </div>
          </div>
        </div>
      </div>
      <div v-else style="height: 320px;margin-top: 12px;display: flex; justify-content: center; align-items: center">
        <n-spin size="medium" />
      </div>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { icon } from '@/plugins'
import { PreviewLoading } from '@/views/preview/components/PreviewLoading'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true
  },
  device: {
    type: Object,
    required: true
  }
})

const { CloseOutlineIcon, CheckmarkIcon, CloseIcon } = icon.ionicons5
const { DeleteIcon, EditIcon } = icon.carbon

let emit = defineEmits(['update:showModal'])

interface device {
  field_name: string
  field_value: any
  origin_value: any
  edit: boolean
}

const dataList = ref<Array<device>>([
  {
    field_name: '设备名称',
    field_value: 'update:showModal',
    origin_value: 'update:showModal',
    edit: false
  },
  {
    field_name: 'IP',
    field_value: 'update:showModal',
    origin_value: 'update:showModal',
    edit: false
  }
])

const loading = ref<boolean>(false)

onMounted(() => {
  console.log('modal mounted')
})

const onNegativeClick = () => {
  dataList.value = []
  emit('update:showModal', false)
}

const onEdit = (item: device) => {
  // TODO: update field_value
  item.edit = true
}

const onConfrim = (item: device) => {
  // TODO: update field_value
  item.origin_value = item.field_value
  item.edit = false
}

const onCancel = (item: device) => {
  // TODO: update field_value
  item.field_value = item.origin_value
  item.edit = false
}

watch(
  () => props.showModal,
  value => {
    if (value) {
      //dataList.value = []
      console.log('modal show')
    }
  }
)
</script>

<style lang="scss" scoped>
.modal {
  width: 500px;
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

  &-name {
    font-family: Source Han Sans SC, Source Han Sans SC;
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    text-align: left;
    font-style: normal;
    text-transform: none;
    line-height: 20px;
    margin-bottom: 4px;
  }

  &-value {
    font-family: Source Han Sans SC, Source Han Sans SC;
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.93);
    text-align: left;
    font-style: normal;
    text-transform: none;
    line-height: 32px;
    margin-bottom: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-input {
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 22px;
  }
}
</style>
