<template>
  <div class="project" :class="{ 'dark-theme': designStore.darkTheme }">
    <div class="card left-panel">
      <div class="list-header">
        <div class="card-title">趋势分析</div>
      </div>
    </div>
    <div class="card right-panel">asd</div>
  </div>
</template>

<script setup lang="ts">
import { useDesignStore } from '@/store/modules/designStore/designStore'

const designStore = useDesignStore()
</script>

<style lang="scss" scoped>
.project {
  height: calc(100vh - #{$--header-height} - 36px);
  display: flex;
  padding: 12px;
  gap: 24px;
}

.card {
  @include fetch-bg-color('card-background');
  @include fetch-theme('box-shadow');
  border-radius: 18px;
  backdrop-filter: blur(50px);
  height: 100%;
}

.left-panel {
  flex: 3;
  min-width: 0;
  
}

.right-panel {
  flex: 7;
  min-width: 0;
  
}
</style>
