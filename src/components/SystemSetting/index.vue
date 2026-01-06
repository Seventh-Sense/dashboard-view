<template>
  <n-modal :show="modelShow">
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
            {{ $t('global.sys_set') }}
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
        <div class="modal-class">Dashboard</div>
        <div class="modal-caption">Dashboard 预览限制</div>
        <div class="modal-item">
          <n-input-number v-model:value="setData.preview.limit" :min="1" :max="10" />
        </div>
        <div class="modal-caption">是否支持手指滑动</div>
        <div class="modal-item">
          <n-switch v-model:value="setData.preview.enableSwipe" />
        </div>
      </div>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import SVG_ICON from '@/svg/SVG_ICON'
import { icon } from '@/plugins'
import { setLocalStorage, getLocalStorage } from '@/utils'

const { CloseIcon } = icon.ionicons5

const emit = defineEmits(['update:modelShow'])

const props = defineProps({
  modelShow: Boolean
})

const setData = reactive<any>({
  preview: {
    limit: 3,
    enableSwipe: true
  }
})

onMounted(() => {
  const storedSettings = getLocalStorage('SettingData')

  if (storedSettings) {
    setData.preview = storedSettings
  }
})
const onClose = () => {
  emit('update:modelShow', false)
}

watch(
  () => setData.preview,
  newValue => {

    if (newValue !== undefined) {
      setLocalStorage('SettingData', setData.preview)
    }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.modal {
  width: 720px;
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
    height: 400px;
    margin-top: 8px;
    overflow-y: auto;
  }

  &-class {
    font-size: 16px;
    font-weight: 600;
    color: #{$--color-dark-font};
    margin-bottom: 8px;
  }

  &-caption {
    font-size: 14px;
    font-weight: 400;
    color: #{$--color-dark-font};
  }

  &-item {
    margin-top: 12px;
    margin-bottom: 20px;
  }
}
</style>
