<template>
  <div @click="clickHandle">
    <!-- 创建的图标 -->
    <n-tooltip  placement="right" trigger="hover">
      <template #trigger>
        <n-button >
          {{ $t('global.r_create') }}
        </n-button>
      </template>
      <span>
        {{ $t('project.create_btn') }}
      </span>
    </n-tooltip>
  </div>
  <CreateModal :show="modalShow" @close="closeHandle"></CreateModal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { CreateModal } from './components/CreateModal/index'
import { icon } from '@/plugins'

const { DuplicateIcon, DuplicateOutlineIcon } = icon.ionicons5
const designStore = useDesignStore()

const props = defineProps({
  collapsed: Boolean
})

const modalShow = ref<boolean>(false)

const clickHandle = () => {
  modalShow.value = true
}

const closeHandle = () => {
  modalShow.value = false
}
</script>
