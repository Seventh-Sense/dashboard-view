<template>
  <n-modal :show="isShow">
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
          <img
            style="cursor: pointer"
            @click="onClose"
            width="24"
            height="24"
            :src="SVG_ICON.card_icons.dismiss"
          />
        </n-space>
      </template>

      <div class="modal-name">
        {{ name }}
      </div>
      <div class="modal-porperty">
        {{ $t('device.set_value') }}
      </div>
      <div class="modal-row">
        <div>
          <n-select
            v-if="type === TypeEnum.MV || type === TypeEnum.BV || type === TypeEnum.BO"
            v-model:value="value"
            :options="options"
            :style="{ width: '300px' }"
          />
          <n-input-number v-else v-model:value="value" style="width: 300px" />
        </div>
        <div class="modal-buttons">
          <div class="modal-button modal-button-color2" @click="onRelease">
            {{ $t('device.release') }}
          </div>
          <div class="modal-button modal-button-color1" @click="onSubmit">
            {{ $t('device.compulsion') }}
          </div>
        </div>
      </div>

      <div v-if="isDisplay">
        <div class="modal-porperty">
          {{ $t('device.priority') }}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <n-select
            :placeholder="t('device.priority')"
            v-model:value="priority"
            :options="PriorityOption"
            :style="{ width: '300px' }"
          />
          <div class="modal-button modal-button-color2" style="width: 160px" @click="onReleaseALL">
            {{ $t('device.release_all') }}
          </div>
        </div>
      </div>

      <div class="modal-advance" @click="onClick">
        {{ $t('device.advance_option') }}

        <Icon
          v-if="isDisplay"
          name="arrowUp"
          type="color-white"
          :size="28"
          :color="{ normal: 'white' }"
        />

        <Icon v-else name="arrowDown" type="color-white" :size="28" :color="{ normal: 'white' }" />
      </div>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import SVG_ICON from '@/svg/SVG_ICON'
import { ref, watch, inject, onUnmounted, onMounted } from 'vue'
import { PriorityOption, TypeEnum, isPriority } from '../../utils/propertyMap'
import { Icon } from '@/icon/index'
import { msghandle } from '@/utils'
import { readIotPoints } from '@/api/http'

let emit = defineEmits(['update:isShow'])

const t = window['$t']

const props = defineProps({
  isShow: {
    type: Boolean,
    required: true
  },
  deviceData: {
    type: Object,
    required: true
  },
  displayData: {
    type: Object,
    required: true
  },
  options: {
    type: Array,
    required: true
  }
})

const refreshObjTable: any = inject('refreshObjTable')

const type = ref(props.displayData.metric_type)

const name = ref('')
const value = ref<any>()
const priority = ref(null)

const isDisplay = ref(false)

const onClick = () => {
  isDisplay.value = !isDisplay.value
}

const onRelease = () => {
  if (priority.value === null) {
    window['$message'].warning(t('msg.msg_error_7'))
    return
  }

  let load = {
    function: 'write_property',
    parms: {
      address: props.deviceData.address,
      objid: props.displayData.metric_uid,
      prop: 'present-value',
      value: null,
      priority: priority.value
    }
  }

  sendOrder(load)
}

const onSubmit = async () => {
  let load = {
    function: 'write_property',
    parms: {
      address: props.deviceData.address,
      objid: props.displayData.metric_uid,
      prop: 'present-value',
      value: value.value,
      ...(isPriority(type.value) && priority.value !== null && { priority: priority.value })
    }
  }

  sendOrder(load)
}

const onReleaseALL = async () => {
  const requests = Array.from({ length: 16 }, (_, i) => {
    const priority = i + 1 // 1-16
    return sendOrder(
      {
        function: 'write_property',
        parms: {
          address: props.deviceData.address,
          objid: props.displayData.metric_uid,
          prop: 'present-value',
          value: null,
          priority: priority
        }
      },
      false
    )
  })

  try {
    const results = await Promise.allSettled(requests)

    const successCount = results.filter(
      r => r.status === 'fulfilled' && (r as PromiseFulfilledResult<any>).value.status === 'OK'
    ).length

    const totalCount = results.length;

    if (successCount === totalCount) {
      window['$message'].success(t('device.msg_mod_success'))
    } else {
      window['$message'].warning(t('device.msg_error_2'))
    }
    
  } catch (error) {
    console.error('Batch release error:', error)
  }
}

const sendOrder = async (load: any, flag: boolean = true) => {
  try {
    const res: any = await readIotPoints(props.deviceData.key, load)

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      if (flag) {
        msghandle(res)
      }
      return
    }

    if (flag) {
      window['$message'].success(t('device.msg_mod_success'))
    }

    return res
  } catch (error) {
    console.error('Error saving value:', error)
  }
}

const onClose = () => {
  emit('update:isShow', false)
}

watch(
  () => props.isShow,
  newVal => {
    if (newVal) {
      if (props.displayData && props.displayData.properties) {
        if (props.displayData.properties.hasOwnProperty('object-name')) {
          name.value = props.displayData.properties['object-name']
        }

        if (props.displayData.properties.hasOwnProperty('present-value')) {
          value.value = props.displayData.properties['present-value']
          //console.log('newVal', props.displayData.properties)
        }
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss" scoped>
.modal {
  width: 640px;
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

  &-advance {
    font-size: 20px;
    color: #{$--color-dark-font};
    font-style: normal;
    text-transform: none;
    font-weight: bold;
    margin-top: 20px;
    cursor: pointer;
  }

  &-name {
    font-size: 24px;
    color: #{$--color-dark-font};
    font-style: normal;
    text-transform: none;
    font-weight: bold;
  }

  &-porperty {
    font-size: 12px;
    color: #{$--color-dark-modal-title};
    font-style: normal;
    font-weight: 400;
    margin-top: 12px;
    margin-bottom: 8px;
  }

  &-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  &-buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
  }

  &-button {
    width: 88px;
    height: 32px;
    border-radius: 2px;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &-color1 {
      background-color: #{$--color-dark-button1};
    }

    &-color2 {
      background-color: #{$--color-dark-button2};
      border: 1px solid #{$--color-dark-button2-border};
    }
  }
}

::v-deep(.n-input) {
  background-color: transparent;
}

::v-deep(.n-input-wrapper) {
  background-color: #{$--color-dark-modal-content};
  border-bottom: 1px solid #{$--color-dark-modal-title};
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
  --n-color-active: #{$--color-dark-modal-content} !important;
  --n-color-disabled: #{$--color-dark-modal-content} !important;
  --n-padding-single: 0 26px 0 0 !important;
}

::v-deep(.n-base-selection-label) {
  background-color: #{$--color-dark-modal-content};
}
</style>
