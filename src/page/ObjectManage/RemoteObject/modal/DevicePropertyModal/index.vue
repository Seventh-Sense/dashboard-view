<template>
  <n-modal :show="isShowModal">
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
          <span class="modal-title">
            {{ $t('device.detail') }}
          </span>
          <img
            style="cursor: pointer"
            @click="onClose"
            width="24"
            height="24"
            :src="SVG_ICON.card_icons.dismiss"
          />
        </n-space>
      </template>
      <div class="modal-content">
        <div v-for="([key, val], index) in sortedEntries" :key="key" class="modal-content-item">
          <span class="modal-content-porperty">{{ PROPERTY_TYPE_MAP(key) }}</span>
          <div v-if="key === 'object-type'" class="modal-content-value">
            {{ getDeviceTypeName(val) }}
          </div>
          <div v-else-if="key === 'object-identifier'" class="modal-content-value">
            {{ objIDTrans(val) }}
          </div>
          <div v-else-if="key === 'description'">
            <div v-if="!editStates[key]" class="modal-content-editvalue">
              <span>{{ val }}</span>
              <n-icon size="20" class="go-cursor-pointer" @click="() => enterEditMode(key)">
                <EditIcon />
              </n-icon>
            </div>
            <div v-else class="modal-content-editvalue">
              <n-input v-model:value="tempValues[key]" type="text" />
              <n-icon size="20" class="go-cursor-pointer" @click="() => handleSave(key)">
                <CheckmarkIcon />
              </n-icon>
              <n-icon size="20" class="go-cursor-pointer" @click="() => cancelEdit(key)">
                <CloseIcon />
              </n-icon>
            </div>
          </div>
          <div v-else-if="key === 'units'" class="modal-content-value">
            {{ unitsTrans(val) }}
          </div>
          <div v-else class="modal-content-value">
            {{ val }}
          </div>
        </div>
      </div>

      <template #footer>
        <n-space justify="end">
          <n-button class="modal-button-ok" @click="onSubmit">{{ $t('global.r_ok') }}</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import SVG_ICON from '@/svg/SVG_ICON'
import { onMounted, computed, ref, reactive, inject, watch } from 'vue'
import {
  PROPERTY_TYPE_MAP,
  objIDTrans,
  unitsTrans,
  presentValueTrans
} from '../../utils/propertyMap'
import { getDeviceTypeName } from '../../utils/utils'
import { icon } from '@/plugins'
import { readIotPoints } from '@/api/http'

const { EditIcon } = icon.carbon
const { CloseIcon, CheckmarkIcon } = icon.ionicons5

const props = defineProps({
  isShowModal: {
    type: Boolean,
    required: true
  },
  displayData: {
    type: Object,
    required: true
  },
  deviceData: {
    type: Object,
    required: true
  }
})
let emit = defineEmits(['update:isShowModal'])

const t = window['$t']
//const refreshObjTable: any = inject('refreshObjTable')
interface EditState {
  [key: string]: boolean
}

const defaultPriority = ['object-name', 'object-type', 'object-identifier', 'description']

const obj = ref(props.displayData.properties)

const sortedEntries = ref<[string, any][]>([])

const editStates = reactive<EditState>({})
const tempValues = reactive<Record<string, any>>({})

onMounted(() => {
  //console.log('aaa', sortedEntries.value)
})

// 进入编辑模式
const enterEditMode = (key: string) => {
  editStates[key] = true
  tempValues[key] = sortedEntries.value.find(([k]) => k === key)?.[1]
}

// 保存修改
const handleSave = async (key: string) => {
  try {
    const res: any = await readIotPoints(props.deviceData.key, {
      function: 'write_property',
      parms: {
        address: props.deviceData.address,
        objid: obj.value['object-identifier'].join(','),
        prop: key,
        value: tempValues[key]
      }
    })

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      window['$message'].warning(res.data)
      return
    }

    window['$message'].success(t('device.msg_mod_success'))

    // 更新 sortedEntries 的值
    obj.value = {
      ...obj.value,
      [key]: tempValues[key] // 更新值
    }

    editStates[key] = false
  } catch (error) {
    console.error('Error saving value:', error)
  }
}

// 取消编辑
const cancelEdit = (key: string) => {
  editStates[key] = false
}

const onClose = () => {
  emit('update:isShowModal', false)
}

const onSubmit = () => {
  //刷新数据
  //refreshObjTable()

  emit('update:isShowModal', false)
}

watch(
  () => props.isShowModal,
  value => {
    if (value) {
      const priorityEntries = defaultPriority
        .filter(key => obj.value[key] !== undefined)
        .map(key => [key.toString(), obj.value[key]])

      // 处理其他属性（保持原始顺序）
      const otherEntries = Object.entries(obj.value).filter(
        ([key]) => !defaultPriority.includes(key)
      )

      sortedEntries.value = [...priorityEntries, ...otherEntries] as [string, any][]

      sortedEntries.value.forEach(([key, val]: [string, any]) => {
        if (!(key in editStates)) {
          editStates[key] = false
          tempValues[key] = val
        }
      })
    }
  }
)
</script>

<style lang="scss" scoped>
.modal {
  width: 720px;
  background: #{$--color-dark-modal-content};
  backdrop-filter: blur(50px);
  border-radius: 18px;

  &-title {
    font-size: 20px;
    color: #{$--color-dark-font};
    font-style: normal;
    text-transform: none;
    font-weight: bold;
  }

  &-content {
    height: 400px;
    margin-top: 16px;
    overflow-y: auto;

    &-item {
      margin-bottom: 13px;
      padding-right: 16px;
    }

    &-porperty {
      font-weight: 400;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      line-height: 17px;
      text-align: left;
      font-style: normal;
    }

    &-value {
      color: rgba(255, 255, 255, 0.38);
      border-bottom: 1px solid rgba(255, 255, 255, 0.6);
    }

    &-editvalue {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 34px;
    }
  }

  &-button-close {
    width: 64px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #{$--color-dark-border};
    border-radius: 2px;
    background-color: #{$--color-dark-card-image};
    cursor: pointer;
  }

  &-button-ok {
    width: 64px;
    height: 32px;
    border: 0;
    border-radius: 2px;
  }
}
</style>
