<template>
  <div @click="clickHandle">
    <!-- 创建的图标 -->
    <n-tooltip  placement="right" trigger="hover">
      <template #trigger>
        <n-button class="button">
          {{ $t('global.r_create') }}
        </n-button>
      </template>
      <span>
        {{ $t('project.create_btn') }}
      </span>
    </n-tooltip>
  </div>
  <CreateModal v-model:modelShow="modelShowInfo"></CreateModal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { CreateModal } from './components/CreateModal/index'

const props = defineProps({
  collapsed: Boolean
})

const modelShowInfo = ref(false)

const clickHandle = () => {
  modelShowInfo.value = true
}
</script>

<style lang="scss" scoped>
.button {
  width: 78px;
  height: 34px;
}
</style>
