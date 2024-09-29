<template>
  <n-modal v-model:show="showModal" :mask-closable="false">
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
          <span class="modal-title">设置Modbus</span>
          <n-icon size="32" :depth="1" @click="onNegativeClick" style="cursor: pointer">
            <CloseOutlineIcon />
          </n-icon>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { icon } from '@/plugins'

const { CloseOutlineIcon } = icon.ionicons5

let emit = defineEmits(['update:showModal'])
const props = defineProps({
  showModal: {
    type: Boolean,
    required: true
  }
})

const onNegativeClick = () => {
  emit('update:showModal', false)
}
</script>

<style lang="scss" scoped>
.modal {
  width: 864px;
  background: rgba(0, 0, 0, 1);
  backdrop-filter: blur(50px);
  border-radius: 18px;

  &-title {
    font-size: 20px;
    color: #{$--color-dark-font};
    font-style: normal;
    text-transform: none;
    font-weight: bold;
  }
}
</style>
