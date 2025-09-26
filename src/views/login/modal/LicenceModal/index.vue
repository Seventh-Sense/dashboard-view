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
            {{ $t('login.accredit') }}
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

      <div style="height: 160px">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            margin-top: 12px;
          "
        >
          <span>
            <span style="font-weight: bold; margin-right: 12px; font-size: 16px">
              {{ $t('login.machine') }}:
            </span>
            <span style="font-size: 14px">{{ machine_id }}</span>
          </span>
          <div class="modal-button-close" @click="copy">{{ $t('global.r_clone') }}</div>
        </div>
        <div style="margin-bottom: 16px; font-size: 14px">{{ $t('login.accredit_msg') }}:</div>
        <div>
          <n-input type="text" v-model:value="value" style="width: 100%"></n-input>
        </div>
      </div>

      <template #footer>
        <n-space justify="end">
          <n-button class="modal-button-ok" :loading="loading" @click="onSubmit">
            {{ $t('global.r_ok') }}
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { submitLicence } from '@/api/http'
import SVG_ICON from '@/svg/SVG_ICON'
import { ref } from 'vue'

let emit = defineEmits(['update:isShowModal'])
const props = defineProps({
  isShowModal: {
    type: Boolean,
    required: true
  },
  machine_id: {
    type: String,
    required: true
  }
})

const loading = ref(false)

const value = ref('')

const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.machine_id)
    window['$message'].success(window['$t']('login.copy_msg'))
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const onSubmit = async () => {
  try {
    const res: any = await submitLicence({
      license: value.value
    })

      
    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.data)
      window['$message'].warning(window['$t']('login.accredit_msg2'))
      return
    }

    window['$message'].success(window['$t']('login.accredit_msg1'))
    emit('update:isShowModal', false)
  } catch (error) {
    console.error('Failed to submit: ', error)
  } finally {
    loading.value = false
  }
}

const onClose = () => {
  emit('update:isShowModal', false)
}
</script>

<style lang="scss" scoped>
.modal {
  width: 800px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(50px);
  border-radius: 18px;

  &-button-close {
    width: 72px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #{$--color-dark-border};
    border-radius: 50px;
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
