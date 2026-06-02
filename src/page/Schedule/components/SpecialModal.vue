<template>
  <n-modal :show="visible" @update:show="$emit('update:visible', $event)">
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
            {{ isEdit ? $t('schedule.edit_special_schedule') : $t('schedule.add_special_schedule') }}
          </span>
          <n-icon
            size="32"
            :depth="1"
            @click="$emit('update:visible', false)"
            style="cursor: pointer"
          >
            <CloseOutlineIcon />
          </n-icon>
        </n-space>
      </template>
      <div class="modal-content">
        <!-- 第一行：模式和优先级 -->
        <div class="form-row">
          <div class="form-item">
            <div class="modal-tip">{{ $t('schedule.mode') }}:</div>
            <n-select
              v-model:value="form.mode"
              :options="modeOptions"
              class="form-select"
            />
          </div>
          <div class="form-item">
            <div class="modal-tip">{{ $t('schedule.priority') }}:</div>
            <n-select
              v-model:value="form.priority"
              :options="priorityOptions"
              class="form-select"
            />
          </div>
        </div>

        <!-- 第二行：日期选择（根据模式显示不同内容） -->
        <template v-if="form.mode === 'single'">
          <!-- 单个日期模式：年月日周 -->
          <div class="form-row">
            <div class="form-item">
              <div class="modal-tip">{{ $t('schedule.year') }}:</div>
              <n-select
                v-model:value="form.date.year"
                :options="yearOptions"
                class="form-select"
                clearable
                :placeholder="$t('schedule.unlimited')"
              />
            </div>
            <div class="form-item">
              <div class="modal-tip">{{ $t('schedule.month') }}:</div>
              <n-select
                v-model:value="form.date.month"
                :options="monthOptions"
                class="form-select"
                clearable
                :placeholder="$t('schedule.unlimited')"
              />
            </div>
            <div class="form-item">
              <div class="modal-tip">{{ $t('schedule.day') }}:</div>
              <n-select
                v-model:value="form.date.day"
                :options="dayOptions"
                class="form-select"
                clearable
                :placeholder="$t('schedule.unlimited')"
              />
            </div>
            <div class="form-item">
              <div class="modal-tip">{{ $t('schedule.week') }}:</div>
              <n-select
                v-model:value="form.date.week"
                :options="weekOptions"
                class="form-select"
                clearable
                :placeholder="$t('schedule.unlimited')"
              />
            </div>
          </div>
        </template>
        
        <template v-else>
          <!-- 日期范围模式：开始日期 -->
          <div class="form-row">
            <div class="form-item">
              <div class="modal-tip">{{ $t('schedule.start_year') }}:</div>
              <n-select
                v-model:value="form.dateRange.startDate.year"
                :options="yearOptions"
                class="form-select"
                clearable
                :placeholder="$t('schedule.unlimited')"
              />
            </div>
            <div class="form-item">
              <div class="modal-tip">{{ $t('schedule.start_month') }}:</div>
              <n-select
                v-model:value="form.dateRange.startDate.month"
                :options="monthOptions"
                class="form-select"
                clearable
                :placeholder="$t('schedule.unlimited')"
              />
            </div>
            <div class="form-item">
              <div class="modal-tip">{{ $t('schedule.start_day') }}:</div>
              <n-select
                v-model:value="form.dateRange.startDate.day"
                :options="dayOptions"
                class="form-select"
                clearable
                :placeholder="$t('schedule.unlimited')"
              />
            </div>
            <div class="form-item">
              <div class="modal-tip">{{ $t('schedule.start_week') }}:</div>
              <n-select
                v-model:value="form.dateRange.startDate.week"
                :options="weekOptions"
                class="form-select"
                clearable
                :placeholder="$t('schedule.unlimited')"
              />
            </div>
          </div>
          
          <!-- 日期范围模式：结束日期 -->
          <div class="form-row">
            <div class="form-item">
              <div class="modal-tip">{{ $t('schedule.end_year') }}:</div>
              <n-select
                v-model:value="form.dateRange.endDate.year"
                :options="yearOptions"
                class="form-select"
                clearable
                :placeholder="$t('schedule.unlimited')"
              />
            </div>
            <div class="form-item">
              <div class="modal-tip">{{ $t('schedule.end_month') }}:</div>
              <n-select
                v-model:value="form.dateRange.endDate.month"
                :options="monthOptions"
                class="form-select"
                clearable
                :placeholder="$t('schedule.unlimited')"
              />
            </div>
            <div class="form-item">
              <div class="modal-tip">{{ $t('schedule.end_day') }}:</div>
              <n-select
                v-model:value="form.dateRange.endDate.day"
                :options="dayOptions"
                class="form-select"
                clearable
                :placeholder="$t('schedule.unlimited')"
              />
            </div>
            <div class="form-item">
              <div class="modal-tip">{{ $t('schedule.end_week') }}:</div>
              <n-select
                v-model:value="form.dateRange.endDate.week"
                :options="weekOptions"
                class="form-select"
                clearable
                :placeholder="$t('schedule.unlimited')"
              />
            </div>
          </div>
        </template>

        <!-- 第四行：时间和值 -->
        <div class="form-row">
          <div class="form-item">
            <div class="modal-tip">{{ $t('schedule.time') }}:</div>
            <n-time-picker
              v-model:value="form.time"
              type="time"
              format="HH:mm"
              class="form-time-picker"
            />
          </div>
          <div class="form-item">
            <div class="modal-tip">{{ $t('schedule.value') }}:</div>
            <n-input
              v-model:value="form.value"
              type="text"
              :placeholder="$t('schedule.value_placeholder')"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <n-space justify="end">
          <n-button @click="$emit('update:visible', false)">{{ $t('schedule.cancel') }}</n-button>
          <n-button type="primary" @click="handleSave">{{ $t('schedule.save') }}</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { icon } from '@/plugins'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const { CloseOutlineIcon } = icon.ionicons5
const { t } = useI18n()
const message = useMessage()

const props = defineProps<{
  visible: boolean
  isEdit?: boolean
  editData?: any
}>()

const emit = defineEmits(['update:visible', 'save'])

const modeOptions = [
  { label: '日期', value: 'single' },
  { label: '日期范围', value: 'range' }
]

const priorityOptions = Array.from({ length: 16 }, (_, i) => ({
  label: String(i + 1),
  value: i + 1
}))

const yearOptions = [
  { label: t('schedule.unlimited'), value: '' },
  ...Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - 50 + i
    return { label: String(year), value: year }
  })
]

const monthOptions = [
  { label: t('schedule.unlimited'), value: '' },
  ...Array.from({ length: 12 }, (_, i) => ({
    label: String(i + 1).padStart(2, '0'),
    value: i + 1
  }))
]

const dayOptions = [
  { label: t('schedule.unlimited'), value: '' },
  ...Array.from({ length: 31 }, (_, i) => ({
    label: String(i + 1).padStart(2, '0'),
    value: i + 1
  }))
]

const weekOptions = [
  { label: t('schedule.unlimited'), value: '' },
  { label: t('schedule.monday'), value: 'mon' },
  { label: t('schedule.tuesday'), value: 'tue' },
  { label: t('schedule.wednesday'), value: 'wed' },
  { label: t('schedule.thursday'), value: 'thu' },
  { label: t('schedule.friday'), value: 'fri' },
  { label: t('schedule.saturday'), value: 'sat' },
  { label: t('schedule.sunday'), value: 'sun' }
]

const form = reactive({
  mode: 'single' as 'single' | 'range',
  priority: 8,
  dateType: 'date' as 'year' | 'month' | 'date' | 'week',
  date: {
    year: '',
    month: '',
    day: '',
    week: ''
  },
  dateRange: {
    startDate: {
      year: '',
      month: '',
      day: '',
      week: ''
    },
    endDate: {
      year: '',
      month: '',
      day: '',
      week: ''
    }
  },
  time: null as any,
  value: ''
})

// 重置表单
const resetForm = () => {
  form.mode = 'single'
  form.priority = 8
  form.dateType = 'date'
  form.date = {
    year: '',
    month: '',
    day: '',
    week: ''
  }
  form.dateRange = {
    startDate: {
      year: '',
      month: '',
      day: '',
      week: ''
    },
    endDate: {
      year: '',
      month: '',
      day: '',
      week: ''
    }
  }
  form.time = null
  form.value = ''
}

// 将时间字符串转换为时间选择器格式
const parseTimeString = (timeStr: string | undefined) => {
  if (!timeStr) return null
  
  // 如果是字符串格式如 "08:00"，需要转换为时间戳
  if (typeof timeStr === 'string') {
    const [hours, minutes] = timeStr.split(':').map(Number)
    const now = new Date()
    const time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
    return time.getTime()
  }
  
  return timeStr
}

// 监听 visible 变化，初始化表单
watch(() => props.visible, (newVal) => {
  console.log('SpecialModal - props:', {
    visible: props.visible,
    isEdit: props.isEdit,
    editData: props.editData
  })
  
  if (newVal && props.isEdit && props.editData) {
    // 先重置表单
    resetForm()
    
    // 填充基本数据
    form.mode = props.editData.mode
    form.priority = props.editData.priority
    form.dateType = props.editData.dateType
    form.value = props.editData.value
    
    // 转换并填充时间
    form.time = parseTimeString(props.editData.time)
    
    // 直接填充日期字段（新的嵌套数据结构）
    if (props.editData.mode === 'single') {
      form.date.year = props.editData.date?.year || ''
      form.date.month = props.editData.date?.month || ''
      form.date.day = props.editData.date?.day || ''
      form.date.week = props.editData.date?.week || ''
    } else if (props.editData.mode === 'range') {
      form.dateRange.startDate.year = props.editData.dateRange?.startDate?.year || ''
      form.dateRange.startDate.month = props.editData.dateRange?.startDate?.month || ''
      form.dateRange.startDate.day = props.editData.dateRange?.startDate?.day || ''
      form.dateRange.startDate.week = props.editData.dateRange?.startDate?.week || ''
      form.dateRange.endDate.year = props.editData.dateRange?.endDate?.year || ''
      form.dateRange.endDate.month = props.editData.dateRange?.endDate?.month || ''
      form.dateRange.endDate.day = props.editData.dateRange?.endDate?.day || ''
      form.dateRange.endDate.week = props.editData.dateRange?.endDate?.week || ''
    } else {
      // 其他模式，也使用 date 和 dateRange
      form.date.year = props.editData.date?.year || ''
      form.date.month = props.editData.date?.month || ''
      form.date.day = props.editData.date?.day || ''
      form.date.week = props.editData.date?.week || ''
      form.dateRange.endDate.year = props.editData.dateRange?.endDate?.year || ''
      form.dateRange.endDate.month = props.editData.dateRange?.endDate?.month || ''
      form.dateRange.endDate.day = props.editData.dateRange?.endDate?.day || ''
      form.dateRange.endDate.week = props.editData.dateRange?.endDate?.week || ''
    }
    
    console.log('编辑模式 - 表单数据:', {
      mode: form.mode,
      priority: form.priority,
      dateType: form.dateType,
      date: form.date,
      dateRange: form.dateRange,
      time: form.time,
      value: form.value
    }, form.dateRange)
  } else if (newVal && !props.isEdit) {
    // 添加模式，重置表单
    resetForm()
  }
}, { immediate: true })

const formatTime = (time: any) => {
  if (!time) return ''
  
  if (typeof time === 'string') {
    return time
  }
  
  // 如果是数字（时间戳）
  if (typeof time === 'number') {
    const date = new Date(time)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }
  
  if (time instanceof Date) {
    const hours = String(time.getHours()).padStart(2, '0')
    const minutes = String(time.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }
  
  if (typeof time === 'object' && time._d instanceof Date) {
    return formatTime(time._d)
  }
  
  return ''
}

const buildDateString = (
  year: string | number,
  month: string | number,
  day: string | number,
  week: string | number
) => {
  const parts = []
  
  if (year) parts.push(`${year}`)
  if (month) parts.push(String(month).padStart(2, '0'))
  if (day) parts.push(String(day).padStart(2, '0'))
  if (week) parts.push(`W${week}`)
  
  return parts.length > 0 ? parts.join('-') : ''
}

const handleSave = () => {
  // 校验时间
  const timeStr = formatTime(form.time)
  if (!timeStr) {
    message.error(t('schedule.please_select_time'))
    return
  }
  
  // 校验值
  if (!form.value || !form.value.trim()) {
    message.error(t('schedule.please_enter_value'))
    return
  }
  
  // 校验值长度
  if (form.value.trim().length > 100) {
    message.error(t('schedule.value_max_length'))
    return
  }
  
  // 年月日周可以为空（不限），不需要校验
  
  // 构建 date 对象（单个日期模式）
  const date: { year?: string; month?: string; day?: string; week?: string } = {}
  if (form.date.year) date.year = form.date.year
  if (form.date.month) date.month = form.date.month
  if (form.date.day) date.day = form.date.day
  if (form.date.week) date.week = form.date.week
  
  // 构建 dateRange 对象（日期范围模式）
  const dateRange: { startDate?: { year?: string; month?: string; day?: string; week?: string }; endDate?: { year?: string; month?: string; day?: string; week?: string } } | undefined = 
    form.mode === 'range' ? {} : undefined
  
  if (dateRange) {
    const startDate: { year?: string; month?: string; day?: string; week?: string } = {}
    if (form.dateRange.startDate.year) startDate.year = form.dateRange.startDate.year
    if (form.dateRange.startDate.month) startDate.month = form.dateRange.startDate.month
    if (form.dateRange.startDate.day) startDate.day = form.dateRange.startDate.day
    if (form.dateRange.startDate.week) startDate.week = form.dateRange.startDate.week
    
    const endDate: { year?: string; month?: string; day?: string; week?: string } = {}
    if (form.dateRange.endDate.year) endDate.year = form.dateRange.endDate.year
    if (form.dateRange.endDate.month) endDate.month = form.dateRange.endDate.month
    if (form.dateRange.endDate.day) endDate.day = form.dateRange.endDate.day
    if (form.dateRange.endDate.week) endDate.week = form.dateRange.endDate.week
    
    dateRange.startDate = Object.keys(startDate).length > 0 ? startDate : undefined
    dateRange.endDate = Object.keys(endDate).length > 0 ? endDate : undefined
  }
  
  const result = {
    mode: form.mode,
    priority: form.priority,
    dateType: form.dateType,
    date: form.mode === 'single' && Object.keys(date).length > 0 ? date : undefined,
    dateRange: form.mode === 'range' && dateRange ? dateRange : undefined,
    value: form.value.trim(),
    time: timeStr
  }
  
  message.success(t('schedule.special_schedule_saved'))
  emit('save', result)
  emit('update:visible', false)
}

watch(() => form.mode, () => {
  if (form.mode === 'single') {
    // 切换到单日期模式，清空结束日期
    form.dateRange.endDate.year = ''
    form.dateRange.endDate.month = ''
    form.dateRange.endDate.day = ''
    form.dateRange.endDate.week = ''
  }
  // 切换到日期范围模式时，不清空开始日期，保留用户输入
})

// 监听弹窗关闭，重置表单
watch(() => props.visible, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})
</script>

<style lang="scss" scoped>
.modal {
  width: 900px;
  background: linear-gradient(145deg, rgba(18, 18, 28, 0.98), rgba(12, 12, 18, 0.98));
  backdrop-filter: blur(60px);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;

  &-title {
    font-size: 20px;
    color: #ffffff;
    font-style: normal;
    text-transform: none;
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  &-content {
    padding: 0;
  }

  &-tip {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.75);
    font-style: normal;
    font-weight: 500;
    margin-top: 24px;
    margin-bottom: 12px;
    letter-spacing: 0.2px;
  }
}

.form-row {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  
  &:first-child {
    margin-top: 0;
  }
}

.form-item {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-input {
  border-radius: 14px;
  border: 1.5px solid rgba(102, 102, 255, 0.2);
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  :deep(.n-input__input) {
    color: #ffffff;
    font-size: 15px;
    font-weight: 500;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
  }
  
  &:hover {
    border-color: rgba(102, 102, 255, 0.35);
    background: rgba(255, 255, 255, 0.05);
  }
  
  &:focus-within {
    border-color: rgba(102, 102, 255, 0.45);
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 0 0 2px rgba(102, 102, 255, 0.15);
  }
}

:deep(.n-card-header) {
  border-bottom: 1px solid rgba(102, 102, 255, 0.15);
  padding: 14px 20px;
  background: rgba(102, 102, 255, 0.03);
}

:deep(.n-card-body) {
  padding: 28px 24px;
}

:deep(.n-card-footer) {
  border-top: 1px solid rgba(102, 102, 255, 0.15);
  padding: 18px 24px;
  background: rgba(102, 102, 255, 0.03);
}

:deep(.n-select),
:deep(.n-date-picker),
:deep(.n-time-picker) {
  width: 100%;
  border-radius: 14px;
  border: 1.5px solid rgba(102, 102, 255, 0.2);
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  :deep(.n-picker-input),
  :deep(.n-base-selection) {
    color: #ffffff;
    font-size: 15px;
    font-weight: 500;
    background: transparent;

    input,
    .n-base-selection-label {
      color: #ffffff;
      font-size: 15px;
      font-weight: 500;
      background: transparent;

      &::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }
    }

    .n-base-selection__state-border {
      border-color: rgba(102, 102, 255, 0.2);
    }
  }

  &:hover {
    border-color: rgba(102, 102, 255, 0.35);
    background: rgba(255, 255, 255, 0.05);
  }

  &:focus-within {
    border-color: rgba(102, 102, 255, 0.45);
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 0 0 2px rgba(102, 102, 255, 0.15);
  }
}

:deep(.n-select-menu) {
  background: rgba(20, 20, 30, 0.98);
  border: 1px solid rgba(102, 102, 255, 0.18);
  
  .n-select-option {
    color: #ffffff;
    
    &:hover {
      background: rgba(102, 102, 255, 0.15);
    }
    
    &.n-select-option--selected {
      background: rgba(102, 102, 255, 0.25);
      color: #ffffff;
    }
  }
}

:deep(.n-time-picker-panel) {
  background: rgba(20, 20, 30, 0.98);
  border: 1px solid rgba(102, 102, 255, 0.18);
  
  .n-time-picker-panel-column {
    color: #ffffff;
  }
}

:deep(.n-date-picker-panel) {
  background: rgba(20, 20, 30, 0.98);
  border: 1px solid rgba(102, 102, 255, 0.18);
  
  .n-calendar-table {
    color: #ffffff;
    
    .n-calendar-table-date {
      color: #ffffff;
      
      &:hover {
        background: rgba(102, 102, 255, 0.15);
      }
      
      &.n-calendar-table-date--selected {
        background: linear-gradient(135deg, #6666ff 0%, #8b5cf6 100%);
      }
    }
  }
}

:deep(.n-button) {
  border-radius: 12px;
  font-weight: 600;
  padding: 12px 28px;
  font-size: 14px;
  letter-spacing: 0.3px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:not([type='primary']) {
    background: rgba(255, 255, 255, 0.05);
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(102, 102, 255, 0.5);
      color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &[type='primary'] {
    background: linear-gradient(135deg, #6666ff 0%, #8b5cf6 100%);
    border: none;
    color: #ffffff;
    box-shadow: 0 6px 20px rgba(102, 102, 255, 0.4);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 28px rgba(102, 102, 255, 0.5);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 4px 12px rgba(102, 102, 255, 0.3);
    }
  }
}

:deep(.n-modal-mask) {
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(15px);
}

:deep(.n-base-icon) {
  color: #ffffff;
}
</style>
