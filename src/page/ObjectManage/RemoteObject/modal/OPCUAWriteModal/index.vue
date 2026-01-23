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
            {{ $t('device.set_value_title') }}
          </span>
          <n-icon size="40" :depth="1" @click="onClose" style="cursor: pointer">
            <CloseOutlineIcon />
          </n-icon>
        </n-space>
      </template>

      <div>
        <n-input type="text" v-model:value="value" style="width: 100%; margin-top: 20px"></n-input>
      </div>

      <template #footer>
        <n-space justify="end">
          <div class="modal-button-close" @click="onClose">{{ $t('global.r_cancel') }}</div>
          <n-button class="modal-button-ok" :loading="loading" @click="onSubmit">
            {{ $t('global.r_ok') }}
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { readIotPoints } from '@/api/http'
import { icon } from '@/plugins'
import { onMounted, ref, inject } from 'vue'

const { CloseOutlineIcon } = icon.ionicons5

let emit = defineEmits(['update:isShowModal'])

const props = defineProps({
  isShowModal: {
    type: Boolean,
    required: true
  },
  isEdit: {
    type: Boolean,
    required: true
  },
  deviceData: {
    type: Object,
    required: true
  },
  editData: {
    type: Object,
    required: true
  }
})

const refreshObjTable: any = inject('refreshObjTable')

const value = ref('')
const loading = ref(false)

onMounted(() => {
  if (props.editData && props.editData.value) {
    value.value = String(props.editData.value)
  }
})

const onSubmit = async () => {
  console.log('editData.value:', props.editData)

  try {
    const res: any = await readIotPoints(props.deviceData.key, {
      function: 'write',
      parms: {
        nodeid: props.editData.metric_id,
        value: String(value.value)
      }
    })

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.data)
      window['$message'].warning(res.data)
      return
    }

    if (res.data === false) {
      window['$message'].warning(window['$t']('msg.msg_error_2'))
    }

    //refreshObjTable()
  } catch (e) {
    console.error('onSubmit:', e)
  } finally {
    loading.value = false
    emit('update:isShowModal', false)
  }
}

const onClose = () => {
  emit('update:isShowModal', false)
}
</script>

<style lang="scss" scoped>
.modal {
  @include fetch-bg-color('modal-content-background');
  width: 480px;
  backdrop-filter: blur(50px);
  border-radius: 18px;

  &-title {
    @include fetch-theme-custom('color', 'modal-font-color');
    font-size: 20px;
    color: #{$--color-dark-font};
    font-style: normal;
    text-transform: none;
    font-weight: bold;
  }

  &-porperty {
    @include fetch-theme-custom('color', 'property-color');
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    margin-top: 20px;
  }

  &-button-close {
    width: 72px;
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
    width: 72px;
    height: 32px;
    border: 0;
    border-radius: 2px;
  }
}
</style>
