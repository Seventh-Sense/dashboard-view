<template>
  <n-space>
    <n-icon size="20" :depth="3">
      <fish-icon></fish-icon>
    </n-icon>
    <n-text>
      {{ $t('dashboard.workspace') }} -
      <n-button secondary size="tiny">
        <span class="title">
          {{ comTitle }}
        </span>
      </n-button>
    </n-text>
  </n-space>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getLocalStorage } from '@/utils'
import { icon } from '@/plugins'

const { FishIcon } = icon.ionicons5

const t = window['$t']

const comTitle = computed(() => {
  return getLocalStorage('currentTitle')
})
</script>
<style lang="scss" scoped>
.title {
  padding-left: 5px;
  padding-right: 5px;
  font-size: 15px;
}
</style>
