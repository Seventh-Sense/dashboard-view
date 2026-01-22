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
          <n-icon size="40" :depth="1" @click="onClose" style="cursor: pointer">
            <CloseOutlineIcon />
          </n-icon>
        </n-space>
      </template>
      <div class="modal-content">
        <img width="80" height="80" :src="SVG_ICON.card_icons.logo" />
        <div class="modal-content-title">XPlay by LUBANX</div>
        <div class="modal-content-tip">{{ $t('login.version') }}: {{ version }}</div>
        <div class="modal-content-b">Core: {{ core }}, UI: {{ ui }}</div>
      </div>
      <template #footer>
        <div class="modal-content-foot">
          XPlay © {{ new Date().getFullYear() }} Adveco Technology Co., Ltd. All rights reserved.
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
const core = ref('')
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
          //console.log('Version:', res.Version)
          version.value = res.Version
          core.value = res.info.xplay_core
          ui.value = res.info.xplay_ui
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
  @include fetch-bg-color('modal-content-background');
  width: 512px;
  backdrop-filter: blur(50px);
  border-radius: 18px;

  &-title {
    @include fetch-theme-custom('color','modal-font-color');
    font-size: 20px;
    font-style: normal;
    text-transform: none;
    font-weight: bold;
  }

  &-content {
    height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 24px;

    &-title {
      @include fetch-theme-custom('color','modal-font-color');
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
    }

    &-tip {
      @include fetch-theme-custom('color','modal-font-color');
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
    }

    &-b {
      @include fetch-theme-custom('color','modal-font-color');
      font-size: 12px;
      line-height: 16px;
      font-weight: 400;
    }

    &-foot {
      @include fetch-theme-custom('color','modal-font-color');
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-weight: 400;
    }
  }
}
</style>
