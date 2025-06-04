<template>
  <n-modal :show="isShowModal" :mask-closable="false">
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
            {{ $t('global.r_create') }}
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
      <div>
        <div class="modal-porperty">func</div>
        <n-select v-model:value="data.func" :options="options" :style="{ width: '450px' }" />
        <div class="modal-porperty">trigger</div>
        <n-input v-model:value="data.trigger" type="text" :style="{ width: '450px' }" disabled />
        <div class="modal-porperty">seconds</div>
        <n-input-number v-model:value="data.seconds" style="width: 450px" />
        <div class="modal-porperty">id</div>
        <n-input v-model:value="data.id" type="text" :style="{ width: '450px' }" disabled />
      </div>
      <template #footer>
        <n-space justify="end">
          <n-button class="modal-button-ok" @click="onSubmit">
            {{ $t('global.r_ok') }}
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { addJob } from '@/api/http'
import SVG_ICON from '@/svg/SVG_ICON'
import { ref, watch } from 'vue'

let emit = defineEmits(['update:isShowModal'])
const props = defineProps({
  isShowModal: {
    type: Boolean,
    required: true
  },
  dataList: {
    type: Array,
    required: true
  }
})
const t = window['$t']
const data = ref({
  func: '',
  trigger: 'interval',
  seconds: 0,
  id: '',
  kwargs: {}
})

const options = [
  {
    label: 'monitor_db',
    value: 'xplay.app.task:monitor_db'
  },
  {
    label: 'polling_device',
    value: 'xplay.app.task:polling_device'
  }
]

const onSubmit = async () => {
  try {
    if (dataCheck()) return

    const res: any = await addJob(data.value)

    if (res.job === data.value.id) {
      emit('update:isShowModal', false)
    }
  } catch (e) {
    console.error('Failed to delete jobs:', e)
  }
}

const dataCheck = () => {
  let flag = false

  if (data.value.func === '') {
    window['$message'].warning(t('msg.creat_job_error'))
    return true
  }

  props.dataList.forEach((item: any) => {
    if (item.func === data.value.func) {
      window['$message'].warning(t('msg.creat_job_error'))
      flag = true
    }
  })

  return flag
}

const onClose = () => {
  emit('update:isShowModal', false)
}

watch(
  () => data.value.func,
  newVal => {
    if (newVal === 'xplay.app.task:monitor_db') {
      data.value.id = 'monitor_db'
    } else if (newVal === 'xplay.app.task:polling_device') {
      data.value.id = 'polling_device'
    }
  }
)
</script>

<style lang="scss" scoped>
.modal {
  width: 500px;
  background: #{$--color-dark-modal-content};
  backdrop-filter: blur(50px);
  border-radius: 18px;

  &-button-ok {
    width: 72px;
    height: 32px;
    border: 0;
    border-radius: 2px;
  }

  &-porperty {
    font-weight: 400;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 17px;
    text-align: left;
    font-style: normal;
    margin-bottom: 6px;
    margin-top: 12px;
  }
}

::v-deep(.n-select) {
  border-bottom: 1px solid #{$--color-dark-modal-title};
}

::v-deep(.n-base-selection) {
  --n-border: 0 !important;
  --n-border-active: 0 !important;
  --n-border-hover: 0 !important;
  --n-border-focus: 0 !important;
  --n-box-shadow-active: 0 !important;
  --n-box-shadow-focus: 0 !important;
  --n-color-active: transparent !important;
  --n-color-disabled: transparent !important;
  --n-padding-single: 0 26px 0 0 !important;
}

::v-deep(.n-base-selection-label) {
  background: transparent;
}

::v-deep(.n-input) {
  background: transparent;
}
::v-deep(.n-input--focus) {
  background: transparent !important;
}

::v-deep(.n-input__input-el) {
  border-bottom: 1px solid #{$--color-dark-modal-title};
}
</style>
