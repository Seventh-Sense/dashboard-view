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
            {{ $t('schedule.add_weekly_schedule') }}
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
        <div class="modal-tip">{{ $t('schedule.time') }}:</div>
        <n-time-picker v-model:value="form.time" type="time" format="HH:mm" />

        <div class="modal-tip">{{ $t('schedule.value') }}:</div>
        <n-input
          v-model:value="form.value"
          type="text"
          :placeholder="$t('schedule.value_placeholder')"
        />

        <div class="modal-tip">{{ $t('schedule.select_days') }}:</div>
        <n-space>
          <n-tag
            v-for="day in weekdays"
            :key="day.value"
            :type="form.days.includes(day.value) ? 'primary' : 'default'"
            :closable="form.days.includes(day.value)"
            :class="{ 'tag-active': form.days.includes(day.value) }"
            @click="toggleDay(day.value)"
            @close="removeDay(day.value)"
          >
            {{ day.label }}
          </n-tag>
        </n-space>
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
import { useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { CloseOutlineIcon } = icon.ionicons5
const message = useMessage()
const { t } = useI18n()

const props = defineProps<{
  visible: boolean
  isEdit?: boolean
  editData?: any
}>()

const emit = defineEmits(['update:visible', 'save'])

const weekdays = [
  { label: '周一', value: 'mon' },
  { label: '周二', value: 'tue' },
  { label: '周三', value: 'wed' },
  { label: '周四', value: 'thu' },
  { label: '周五', value: 'fri' },
  { label: '周六', value: 'sat' },
  { label: '周日', value: 'sun' }
]

const form = reactive({
  time: null as number | null,
  value: '',
  days: [] as string[]
})

// 监听弹窗打开，填充编辑数据
watch(
  () => props.visible,
  newVal => {
    if (newVal && props.isEdit && props.editData) {
      // 延迟填充数据，确保组件已初始化
      setTimeout(() => {
        // 处理时间格式：转换为时间戳
        const editTime = props.editData!.time
        if (typeof editTime === 'string') {
          // 将 "HH:mm" 格式转换为时间戳
          const [hours, minutes] = editTime.split(':').map(Number)
          const now = new Date()
          now.setHours(hours, minutes, 0, 0)
          form.time = now.getTime()
        } else if (editTime instanceof Date) {
          form.time = editTime.getTime()
        } else {
          form.time = editTime as number
        }

        form.value = props.editData!.value
        // 编辑模式下，优先使用 day 字段（新格式），否则使用 days 数组（旧格式）
        const currentDay = (props.editData as any).day
        if (currentDay && typeof currentDay === 'string' && currentDay.trim() !== '') {
          form.days = [currentDay]
        } else if (props.editData!.days && props.editData!.days.length > 0) {
          form.days = [...props.editData!.days]
        } else {
          form.days = []
        }
      }, 0)
    } else if (newVal && !props.isEdit) {
      // 新增模式，重置表单
      form.time = null
      form.value = ''
      form.days = []
    }
  },
  { immediate: true }
)

const toggleDay = (day: string) => {
  // 编辑模式下，只允许选择一个星期
  if (props.isEdit) {
    form.days = [day]
  } else {
    const index = form.days.indexOf(day)
    if (index > -1) {
      form.days.splice(index, 1)
    } else {
      form.days.push(day)
    }
  }
}

const removeDay = (day: string) => {
  const index = form.days.indexOf(day)
  if (index > -1) {
    form.days.splice(index, 1)
  }
}

const handleSave = () => {
  // 校验时间
  if (!form.time) {
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

  // 校验星期选择
  if (form.days.length === 0) {
    message.error(t('schedule.please_select_day'))
    return
  }

  // 编辑模式下，只允许一个星期
  if (props.isEdit && form.days.length > 1) {
    message.error(t('schedule.edit_only_one_day'))
    form.days = [form.days[0]]
  }

  emit('save', {
    time: form.time,
    value: form.value.trim(),
    days: [...form.days]
  })
  message.success(t('schedule.weekly_schedule_added'))

  // 重置表单
  form.time = null
  form.value = ''
  form.days = []

  emit('update:visible', false)
}
</script>

<style lang="scss" scoped>
.modal {
  width: 620px;
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

.tag-active {
  background: linear-gradient(135deg, #6666ff 0%, #8b5cf6 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(102, 102, 255, 0.3);
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

:deep(.n-time-picker) {
  width: 100%;
  border-radius: 14px;
  border: 1.5px solid rgba(102, 102, 255, 0.2);
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  :deep(.n-picker-input) {
    color: #ffffff;
    font-size: 15px;
    font-weight: 500;

    input {
      &::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }
    }
  }

  &:hover {
    border-color: rgba(102, 102, 255, 0.35);
    background: rgba(255, 255, 255, 0.05);
  }
}

:deep(.n-input) {
  width: 100%;
  border-radius: 14px;
  border: 1.5px solid rgba(102, 102, 255, 0.2);
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding-left: 8px !important;
  padding-right: 8px !important;

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
}

:deep(.n-tag) {
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  border-radius: 18px;
  padding: 10px 18px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(102, 102, 255, 0.15);
    border-color: rgba(102, 102, 255, 0.4);
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 102, 255, 0.2);
  }

  &.tag-active,
  &[type='primary'] {
    background: linear-gradient(135deg, #6666ff 0%, #8b5cf6 100%) !important;
    border-color: transparent !important;
    color: #ffffff !important;
    box-shadow: 0 4px 16px rgba(102, 102, 255, 0.35);
    transform: translateY(-2px);

    :deep(.n-tag__close) {
      color: #ffffff !important;
      opacity: 0.8;
      transition: all 0.2s;

      &:hover {
        color: #ffffff !important;
        opacity: 1;
      }
    }
  }

  :deep(.n-tag__close) {
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.2s;
    margin-left: 8px !important;

    &:hover {
      color: #ffffff;
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

:deep(.n-space) {
  margin-top: 8px;
}

:deep(.n-base-icon) {
  color: #ffffff;
}
</style>
