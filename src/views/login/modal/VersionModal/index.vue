<template>
  <n-modal :show="showModal">
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
            {{ $t('login.about_us') }}
          </span>
          <n-icon size="32" :depth="1" @click="onClose" style="cursor: pointer">
            <CloseOutlineIcon />
          </n-icon>
        </n-space>
      </template>
      <div class="modal-content">
        <img width="80" height="80" :src="SVG_ICON.card_icons.logo" />
        <div class="modal-content-title">XPlay by LUBANX</div>
        <div class="modal-content-tip">版本: {{ version }}</div>
        <div class="modal-content-b">UI {{ ui }}</div>
      </div>
      <template #footer>
        <div class="modal-content-foot">
          XPlay © 2024 Adveco Technology Co., Ltd. All rights reserved.
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { getVersion } from '@/api/http'
import { icon } from '@/plugins'
import SVG_ICON from '@/svg/SVG_ICON'
import { onMounted, ref, watch } from 'vue'

const { CloseOutlineIcon } = icon.ionicons5

let emit = defineEmits(['update:showModal'])
const props = defineProps({
  showModal: {
    type: Boolean,
    required: true
  }
})

const version = ref('')
const ui = ref('')

onMounted(() => {})

const onClose = () => {
  emit('update:showModal', false)
}

watch(
  () => props.showModal,
  newVal => {
    if (newVal) {
      getVersion()
        .then((res: any) => {
          console.log('Version:', res.Version)
          if (res.Version) {
            version.value = res.Version
          }

          if (res.info) {
            ui.value = res.info.xplayui
          }
        })
        .catch((e: any) => {
          console.error('Get version error:', e)
        })
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.modal {
  width: 512px;
  background: rgba(0, 0, 0, 0.6);
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
    height: 270px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 24px;

    &-title {
      font-size: 14px;
      line-height: 20px;
      color: rgba(255, 255, 255, 0.93);
      font-weight: 400;
    }

    &-tip {
      font-size: 14px;
      line-height: 20px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 400;
    }

    &-b {
      font-size: 12px;
      line-height: 16px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 400;
    }

    &-foot {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 400;
    }
  }
}
</style>
