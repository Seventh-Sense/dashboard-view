<template>
  <n-modal :show="modelShow" class="go-create-modal">
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
          <span class="go-create-modal-title">
            {{ $t('project.project') }}
          </span>
          <n-icon size="32" :depth="1" @click="closeHandle" style="cursor: pointer">
            <CloseOutlineIcon />
          </n-icon>
        </n-space>
      </template>
      <div class="card-box-con">
        <div class="card-box-title">{{ $t('device.project_name') }}</div>
        <n-input v-model:value="project_name" type="text" />
        <div class="card-box-title">{{ $t('device.project_type') }}</div>
        <n-select v-model:value="decs" :options="options" :disabled="isGraphic" />
      </div>
      <template #footer>
        <n-space justify="end">
          <n-button @click="onPositiveClick" style="width: 78px;height: 34px;">{{ $t('global.r_create') }}</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, watch, inject, onMounted, computed } from 'vue'
import { icon } from '@/plugins'
import { createProject } from '@/api/http'
import { JSONStringify } from '@/utils'

const { CloseOutlineIcon } = icon.ionicons5

const t = window['$t']
const initTable: any = inject('initTable')

const emit = defineEmits(['update:modelShow'])

const props = defineProps({
  modelShow: Boolean
})

const isGraphic = computed(() => {
  if (import.meta.env.VITE_APP_IS_GRAPHIC === 'true') {
    return false
  } else {
    return true
  }
})

const project_name = ref('')
const decs = ref('dashboard')

const options: any[] = [
  {
    label: 'Dashboard',
    value: 'dashboard'
  },
  {
    label: 'Graphic',
    value: 'graphic'
  }
]

const onPositiveClick = async () => {
  if (paramCheck()) {
    try {
      let load: any = ''

      if (decs.value === 'graphic') {
        load = {
          useTemplate: false,
          templateRef: '',
          data: '',
          previewImage: '',
          options: '',
          reference: '',
          name: project_name.value,
          description: null,
          type: 'graphic',
          digitalTags: [],
          lastUpdateTime: ''
        }
      }

      const res: any = await createProject({
        name: project_name.value,
        cover: '',
        content: JSONStringify(load),
        description: decs.value
      })

      if (res.status !== 'OK') {
        console.warn('Non-OK response status:', res.status)
        return
      }

      initTable()
    } catch (e) {
      console.error('onChange:', e)
    } finally {
      project_name.value = ''
      emit('update:modelShow', false)
    }
  }
}

const paramCheck = () => {
  let flag = true

  if (project_name.value === '') {
    flag = false
    window['$message'].error(t('msg.modbus_msg_1'))
  }

  if (project_name.value.length > 12) {
    flag = false
    window['$message'].error(t('msg.msg_error_10'))
  }

  return flag
}

// 关闭对话框
const closeHandle = () => {
  project_name.value = ''
  emit('update:modelShow', false)
}
</script>

<style lang="scss" scoped>
$cardWidth: 570px;

.modal {
  @include fetch-bg-color('modal-content1-background');
  width: 600px;
  border-radius: 18px;
}

@include go('create-modal') {
  position: fixed;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);

  &-title {
    @include fetch-theme-custom('color','modal-font-color');
    font-size: 20px;
    font-style: normal;
    text-transform: none;
    font-weight: bold;
  }

  .card-box {
    @include fetch-theme-custom('border-color', 'modal-font-color');
    width: $cardWidth;
    cursor: pointer;
    border-style: solid;
    border-width: 1px;

    @extend .go-transition;

    &:hover {
      @include hover-border-color('hover-border-color');
    }

    &-content {
      padding: 0px 10px;
      width: 100%;
    }

    &-con {
      width: 100%;
    }

    &-title {
      @include fetch-theme-custom('color','modal-font-color');
      font-size: 16px;
      font-weight: bold;
      margin-top: 16px;
      margin-bottom: 12px;
    }
  }
}

::v-deep(.n-card-header) {
  padding: 12px !important;
}

::v-deep(.n-card__content) {
  padding: 0 12px 12px 12px !important;
}

::v-deep(.n-card__footer) {
  padding: 0 12px 12px 12px !important;
}
</style>
