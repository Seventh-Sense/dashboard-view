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
            {{ isEdit ? $t('schedule.edit_object') : $t('schedule.add_object') }}
          </span>
          <n-icon size="32" :depth="1" @click="$emit('update:visible', false)" style="cursor: pointer">
            <CloseOutlineIcon />
          </n-icon>
        </n-space>
      </template>
      <div class="modal-content">
        <div class="modal-tip">{{ $t('schedule.object_name') }}:</div>
        <n-input v-model:value="name" type="text" />

        <div class="modal-tip">{{ $t('schedule.object_type') }}:</div>
        <n-tag type="primary">{{ $t('schedule.schedule') }}</n-tag>

        <div class="modal-tip">{{ $t('schedule.description') }}:</div>
        <n-input v-model:value="description" type="textarea" />
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
import { ref, watch } from 'vue'
import { icon } from '@/plugins'
import { useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { CloseOutlineIcon } = icon.ionicons5
const message = useMessage()
const { t } = useI18n()

const props = defineProps<{
  visible: boolean
  isEdit?: boolean
  editData?: { name: string; description?: string }
}>()

const emit = defineEmits(['update:visible', 'save'])

const name = ref('')
const description = ref('')

watch(() => props.visible, (newVal) => {
  if (newVal && props.isEdit && props.editData) {
    name.value = props.editData.name
    description.value = props.editData.description || ''
  } else if (newVal && !props.isEdit) {
    name.value = ''
    description.value = ''
  }
}, { immediate: true })

const handleSave = () => {
  // 校验名称
  if (!name.value || !name.value.trim()) {
    message.error(t('schedule.please_enter_object_name'))
    return
  }
  
  // 校验名称长度
  if (name.value.trim().length > 50) {
    message.error(t('schedule.object_name_max_length'))
    return
  }
  
  // 校验描述长度
  if (description.value && description.value.length > 200) {
    message.error(t('schedule.description_max_length'))
    return
  }
  
  emit('save', { name: name.value.trim(), description: description.value.trim(), type: 'schedule' })
  message.success(props.isEdit ? t('schedule.object_updated') : t('schedule.object_added'))
  name.value = ''
  description.value = ''
  emit('update:visible', false)
}
</script>

<style lang="scss" scoped>
.modal {
  width: 600px;
  background: rgba(0, 0, 0, 1);
  backdrop-filter: blur(50px);
  border-radius: 18px;

  &-title {
    font-size: 20px;
    color: #ffffff;
    font-style: normal;
    text-transform: none;
    font-weight: bold;
  }

  &-content {
    padding: 0;
  }

  &-tip {
    font-size: 12px;
    color: #e0e0e8;
    font-style: normal;
    font-weight: 400;
    margin-top: 22px;
    margin-bottom: 14px;
  }
}

:deep(.n-card-header) {
  border-bottom: 1px solid rgba(102, 102, 255, 0.12);
  padding: 10px 16px;
}

:deep(.n-card-body) {
  padding: 24px;
}

:deep(.n-card-footer) {
  border-top: 1px solid rgba(102, 102, 255, 0.12);
  padding: 16px 24px;
}

:deep(.n-input) {
  border-radius: 12px;
  border: 1px solid rgba(102, 102, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
  padding: 13px 16px;
  font-size: 14px;
  color: #ffffff;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    border-color: #6666ff;
    box-shadow: 0 0 0 2px rgba(102, 102, 255, 0.15), 0 0 20px rgba(102, 102, 255, 0.2);
  }
}

:deep(.n-tag) {
  background: linear-gradient(135deg, rgba(102, 102, 255, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%);
  color: #a8a8ff;
  border: 1px solid rgba(102, 102, 255, 0.3);
  border-radius: 16px;
  padding: 8px 16px;
  font-weight: 500;
  font-size: 13px;
}

:deep(.n-button) {
  border-radius: 10px;
  font-weight: 600;
  padding: 11px 26px;
  font-size: 14px;

  &:not([type='primary']) {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #b8b8c8;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(102, 102, 255, 0.4);
      color: #ffffff;
    }
  }

  &[type='primary'] {
    background: linear-gradient(135deg, #6666ff 0%, #8b5cf6 100%);
    border: none;
    color: #ffffff;
    box-shadow: 0 4px 16px rgba(102, 102, 255, 0.35);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 22px rgba(102, 102, 255, 0.45);
    }
  }
}

:deep(.n-input-textarea) {
  min-height: 100px;
}

:deep(.n-modal-mask) {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
}
</style>