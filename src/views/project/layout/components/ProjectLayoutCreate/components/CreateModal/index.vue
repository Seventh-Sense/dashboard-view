<template>
  <n-modal v-model:show="showRef" class="go-create-modal">
    <n-card
      :bordered="true"
      role="dialog"
      aria-modal="true"
      size="small"
      :mask-closable="false"
      style="width: 600px; background: rgba(0, 0, 0, 1); border-radius: 18px"
    >
      <template #header>
        <n-space justify="space-between" align="center">
          <span class="go-create-modal-title">
            {{ $t('project.create_tip') }}
          </span>
          <n-icon size="32" :depth="1" @click="closeHandle" style="cursor: pointer">
            <CloseOutlineIcon />
          </n-icon>
        </n-space>
      </template>
      <div class="card-box-con">
        <div class="card-box-title">{{ $t('device.project_name') }}:</div>
        <n-input v-model:value="project_name" type="text" />
        <!-- <div class="card-box-title">{{ $t('device.desc') }}:</div>
        <n-input v-model:value="decs" type="textarea" /> -->
      </div>
      <template #footer>
        <n-space justify="end">
          <n-button @click="onPositiveClick">{{ $t('global.r_create') }}</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, watch, inject } from 'vue'
import { icon } from '@/plugins'
import { createProject } from '@/api/http'

const { CloseOutlineIcon } = icon.ionicons5
const showRef = ref(false)
const t = window['$t']
const initTable: any = inject('initTable')
const emit = defineEmits(['close'])

const props = defineProps({
  show: Boolean
})

const project_name = ref('')
const decs = ref('')

watch(props, newValue => {
  showRef.value = newValue.show
})

const onPositiveClick = async () => {
  if (paramCheck()) {
    try {
      const res: any = await createProject({
        name: project_name.value,
        cover: '',
        content: '',
        description: ''
      })

      if (res.status !== 'OK') {
        console.warn('Non-OK response status:', res.status)
        return
      }

      initTable()
    } catch (e) {
      console.error('onChange:', e)
    } finally {
      emit('close', false)
    }
  }
}

const paramCheck = () => {
  let flag = true

  if (project_name.value === '') {
    flag = false
    window['$message'].error(t('msg.modbus_msg_1'))
  }

  return flag
}

// 关闭对话框
const closeHandle = () => {
  emit('close', false)
}
</script>

<style lang="scss" scoped>
$cardWidth: 570px;

@include go('create-modal') {
  position: fixed;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);

  &-title {
    font-size: 20px;
    color: #{$--color-dark-font};
    font-style: normal;
    text-transform: none;
    font-weight: bold;
  }

  .card-box {
    width: $cardWidth;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0);
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
      font-size: 16px;
      font-weight: bold;
      color: $--color-dark-font;
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
