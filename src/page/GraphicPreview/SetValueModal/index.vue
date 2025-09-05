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
        <n-input-number v-model:value="value" size="large" style="width: 100%" />
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
import { updateNodeData } from '@/packages/public'
import SVG_ICON from '@/svg/SVG_ICON'
import { ref } from 'vue'

const props = defineProps({
  isShowModal: {
    type: Boolean,
    required: true
  },
  data: {
    type: Object,
    required: true
  }
})

let emit = defineEmits(['update:isShowModal'])

const value = ref()

const onSubmit = async () => {
  //console.log('value', value.value)
  if (value.value !== undefined && value.value !== null) {
    let infos = props.data.param.pointRef.split(',')

    let bindinfo = {}

    if (infos[2] === 'bacnet') {
      bindinfo = {
        deviceID: infos[0],
        deviceName: '',
        deviceType: infos[2],
        deviceAddress: infos[3],
        objectID: infos[1],
        objectName: '',
        objectPriority: infos[4],
        objectUid: infos[5] + ',' + infos[6]
      }
    } else {
      bindinfo = {
        deviceID: infos[0],
        deviceName: '',
        deviceType: infos[2],
        objectID: infos[1],
        objectName: '',
        objectPriority: infos[4]
      }
    }

    await updateNodeData(bindinfo, value.value)

    emit('update:isShowModal', false)
  } else {
    emit('update:isShowModal', false)
  }
}

const onClose = () => {
  emit('update:isShowModal', false)
}
</script>

<style lang="scss" scoped>
.modal {
  height: 200px;
  width: 500px;
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
    height: 88px;
    overflow-y: auto;
    display: flex;
    align-items: center;
  }

  &-button-ok {
    width: 64px;
    height: 32px;
    border: 0;
    border-radius: 2px;
  }
}
</style>
