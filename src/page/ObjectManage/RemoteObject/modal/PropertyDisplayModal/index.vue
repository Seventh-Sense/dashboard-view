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
          <div v-if="key === 'priority-array'" class="modal-content-collapse">
            <n-collapse>
              <n-collapse-item :title="t('device.priority_array')" name="1">
                <div v-for="(value, key) in val" :key="key" class="modal-content-collapse-item">
                  <span>{{ key }}</span>
                  <span>{{ value }}</span>
                </div>
              </n-collapse-item>
            </n-collapse>
          </div>
          <div v-else>
            <span class="modal-content-porperty">{{ PROPERTY_TYPE_MAP(key) }}</span>
            <div v-if="key === 'object-type'" class="modal-content-value">
              {{ getDeviceTypeName(val) }}
            </div>
            <div v-else-if="key === 'object-identifier'" class="modal-content-value">
              {{ objIDTrans(val) }}
            </div>
            <div v-else-if="key === 'description'" class="modal-content-editstyle">
              <div v-if="!editStates[key]" class="modal-content-editvalue">
                <span>{{ val }}</span>
                <n-icon size="20" class="go-cursor-pointer" @click="() => enterEditMode(key)">
                  <EditIcon />
                </n-icon>
              </div>
              <div v-else class="modal-content-editvalue">
                <n-input v-model:value="tempValues[key]" type="text" :style="{ width: '600px' }" />
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
            <div v-else-if="key === 'present-value'" class="modal-content-editstyle">
              <div v-if="!editStates[key]" class="modal-content-editvalue">
                <span>{{ presentValueTrans(val, type, BinaryOption, MVOption) }}</span>
                <n-icon size="20" class="go-cursor-pointer" @click="() => enterEditMode(key)">
                  <EditIcon />
                </n-icon>
              </div>
              <div v-else class="modal-content-editvalue">
                <n-select
                  v-if="
                    BinaryOption.length > 0 &&
                    (type === TypeEnum.BI || type === TypeEnum.BV || type === TypeEnum.BO)
                  "
                  v-model:value="tempValues[key]"
                  :options="BinaryOption"
                  :style="{ width: '300px' }"
                />
                <n-select
                  v-else-if="MVOption.length > 0 && type === TypeEnum.MV"
                  v-model:value="tempValues[key]"
                  :options="MVOption"
                  :style="{ width: '300px' }"
                />
                <n-input-number v-else v-model:value="tempValues[key]" style="width: 300px" />
                <n-select
                  :placeholder="t('device.priority')"
                  v-model:value="priority"
                  :options="PriorityOption"
                  :style="{ width: '300px' }"
                  :disabled="!isPriority(type)"
                />
                <n-icon size="20" class="go-cursor-pointer" @click="() => handleSave(key)">
                  <CheckmarkIcon />
                </n-icon>
                <n-icon size="20" class="go-cursor-pointer" @click="() => cancelEdit(key)">
                  <CloseIcon />
                </n-icon>
              </div>
            </div>
            <div v-else-if="key === 'out-of-service'" class="modal-content-editstyle">
              <div v-if="!editStates[key]" class="modal-content-editvalue">
                <span>{{ val === 0 ? 'False' : 'True' }}</span>
                <n-icon size="20" class="go-cursor-pointer" @click="() => enterEditMode(key)">
                  <EditIcon />
                </n-icon>
              </div>
              <div v-else class="modal-content-editvalue">
                <n-select
                  v-model:value="tempValues[key]"
                  :options="BooleanOption"
                  :style="{ width: '600px' }"
                />
                <n-icon size="20" class="go-cursor-pointer" @click="() => handleSave(key)">
                  <CheckmarkIcon />
                </n-icon>
                <n-icon size="20" class="go-cursor-pointer" @click="() => cancelEdit(key)">
                  <CloseIcon />
                </n-icon>
              </div>
            </div>
            <div v-else-if="key === 'status-flags'" class="modal-content-value">
              {{ val instanceof Array ? val.join('') : val }}
            </div>
            <div v-else-if="key === 'relinquish-default'" class="modal-content-editstyle">
              <div v-if="!editStates[key]" class="modal-content-editvalue">
                <span>{{ presentValueTrans(val, type, BinaryOption, MVOption) }}</span>
                <n-icon
                  v-show="val !== 'unknown-property'"
                  size="20"
                  class="go-cursor-pointer"
                  @click="() => enterEditMode(key)"
                >
                  <EditIcon />
                </n-icon>
              </div>
              <div v-else class="modal-content-editvalue">
                <n-select
                  v-if="
                    BinaryOption.length > 0 &&
                    (type === TypeEnum.BI || type === TypeEnum.BV || type === TypeEnum.BO)
                  "
                  v-model:value="tempValues[key]"
                  :options="BinaryOption"
                  :style="{ width: '600px' }"
                />
                <n-select
                  v-else-if="MVOption.length > 0 && type === TypeEnum.MV"
                  v-model:value="tempValues[key]"
                  :options="MVOption"
                  :style="{ width: '600px' }"
                />
                <n-input-number v-else v-model:value="tempValues[key]" style="width: 600px" />
                <n-icon size="20" class="go-cursor-pointer" @click="() => handleSave(key)">
                  <CheckmarkIcon />
                </n-icon>
                <n-icon size="20" class="go-cursor-pointer" @click="() => cancelEdit(key)">
                  <CloseIcon />
                </n-icon>
              </div>
            </div>
            <div v-else class="modal-content-value">
              {{ val }}
            </div>
          </div>
        </div>
        <SetPresentValueModal
          v-if="isShow"
          v-model:isShow="isShow"
          :deviceData="deviceData"
          :displayData="displayData"
          :options="options"
        />
      </div>

      <template #footer>
        <n-space justify="end" style="height: 20px">
          <!-- <n-button class="modal-button-ok" @click="onSubmit">{{ $t('global.r_ok') }}</n-button> -->
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import SVG_ICON from '@/svg/SVG_ICON'
import { onMounted, computed, ref, reactive, inject, watch, onUnmounted } from 'vue'
import {
  PROPERTY_TYPE_MAP,
  objIDTrans,
  unitsTrans,
  TypeEnum,
  presentValueTrans,
  PriorityOption,
  isPriority,
  BooleanOption
} from '../../utils/propertyMap'
import { getDeviceTypeName } from '../../utils/utils'
import { icon } from '@/plugins'
import { readIotPoints, readMetricById } from '@/api/http'
import { msghandle } from '@/utils'
import { SetPresentValueModal } from '../SetPresentValueModal'

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

const isShow = ref(false)
const options = ref([])

const priority = ref(null)

const defaultPriority = ['object-name', 'object-type', 'object-identifier', 'description']

const obj = ref(props.displayData.properties)

const sortedEntries = computed(() => {
  // 处理优先级属性（带类型校验）
  const priorityEntries = defaultPriority
    .filter(key => obj.value[key] !== undefined)
    .map(key => [key.toString(), obj.value[key]])

  // 处理其他属性（保持原始顺序）
  const otherEntries = Object.entries(obj.value).filter(([key]) => !defaultPriority.includes(key))

  return [...priorityEntries, ...otherEntries]
})

const editStates = reactive<EditState>({})
const tempValues = reactive<Record<string, any>>({})

//
const type = ref(props.displayData.metric_type)
const BinaryOption = ref<any>([])
const MVOption = ref<any>([])

let interval: any = null

onMounted(() => {
  initializeStates()

  //当未做修改时，周期性更新值
  interval = setInterval(() => {
    if (!isShow.value && Object.values(editStates).every(value => value === false)) {
      updateInfo()
    }
  }, 3000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

watch(
  () => props.displayData,
  newVal => {
    if (newVal) {
      //console.log('aaa', props.displayData.properties)
    }
  },
  { immediate: true, deep: true }
)

const initializeStates = () => {
  sortedEntries.value.forEach(([key, val]) => {
    if (!(key in editStates)) {
      editStates[key] = false
      tempValues[key] = val
    }
  })

  if (type.value === TypeEnum.BI || type.value === TypeEnum.BV || type.value === TypeEnum.BO) {
    let on = obj.value['active-text']
    let off = obj.value['inactive-text']

    if (
      on === undefined ||
      off === undefined ||
      on === 'unknown-property' ||
      off === 'unknown-property'
    ) {
      BinaryOption.value = []
    } else {
      BinaryOption.value = [
        {
          label: obj.value['inactive-text'],
          value: 0
        },
        {
          label: obj.value['active-text'],
          value: 1
        }
      ]
    }
  } else if (type.value === TypeEnum.MV) {
    let array = obj.value['state-text']

    if (!Array.isArray(array) || array.length === 0) {
      MVOption.value = []
    } else {
      array.forEach((item: any, index: number) => {
        MVOption.value.push({
          label: item,
          value: index + 1
        })
      })
    }
  }
}

// 进入编辑模式
const enterEditMode = (key: string) => {
  if (key === 'present-value' && isPriority(type.value)) {
    if (type.value === TypeEnum.BI || type.value === TypeEnum.BV || type.value === TypeEnum.BO) {
      options.value = BinaryOption.value
    } else if (type.value === TypeEnum.MV) {
      options.value = MVOption.value
    } 
    isShow.value = true
  } else {
    editStates[key] = true
    tempValues[key] = sortedEntries.value.find(([k]) => k === key)?.[1]
  }
}

// 保存修改
const handleSave = async (key: string) => {
  let load = {
    function: 'write_property',
    parms: {
      address: props.deviceData.address,
      objid: props.displayData.metric_uid,
      prop: key,
      value: tempValues[key]
      // ...(isPriority(type.value) &&
      //   key === 'present-value' &&
      //   priority.value !== null && { priority: priority.value })
    }
  }

  try {
    const res: any = await readIotPoints(props.deviceData.key, load)

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      msghandle(res)
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

const updateInfo = async () => {
  try {
    const res: any = await readMetricById(props.displayData.key)

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      return
    }

    if (
      Array.isArray(res.data) &&
      res.data.length === 1 &&
      res.data[0].property &&
      res.data[0].property['object-name']
    ) {
      obj.value = res.data[0].property
      props.displayData.properties = res.data[0].property
      //console.log('sadasd', res.data[0].property['present-value'])
    }
  } catch (error) {
    console.error('Error saving value:', error)
  }
}
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
    height: 600px;
    margin-top: 16px;
    overflow-y: auto;

    &-editstyle {
      border-bottom: 1px solid rgba(255, 255, 255, 0.6);
    }

    &-item {
      margin-bottom: 16px;
      padding-right: 16px;
    }

    &-porperty {
      font-weight: 400;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      line-height: 17px;
      text-align: left;
      font-style: normal;
      margin-bottom: 4px;
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

    &-collapse {
      display: flex;
      align-items: center;
      min-height: 32px;

      &-item {
        height: 32px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 32px;
      }
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

::v-deep(.n-collapse-item__header-main) {
  color: rgba(255, 255, 255, 0.6) !important;
}
</style>
