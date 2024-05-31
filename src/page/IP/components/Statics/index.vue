<template>
  <div class="card-table">
    <div>
      <div class="card-title">IP链路设备</div>
      <div class="card-body">
        <n-list>
          <n-list-item>
            <template #prefix>
              <n-icon :component="CashOutline" size="20" :depth="1" />
            </template>
            <template #suffix>
                <n-icon :component="ChevronForwardOutline" size="20" :depth="1" />
            </template>
            <n-thing>
                device1
            </n-thing>
            
          </n-list-item>
          <n-list-item>
            <template #prefix>
              <n-icon :component="CashOutline" size="20" :depth="1" />
            </template>
            <template #suffix>
                <n-icon :component="ChevronForwardOutline" size="20" :depth="1" />
            </template>
            <n-thing>
                device2
            </n-thing>
            
          </n-list-item>
        </n-list>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CashOutline } from '@vicons/ionicons5'
import { ChevronForwardOutline } from '@vicons/ionicons5'
</script>

<style lang="scss" scoped>
@import '../../../style/table.scss';
</style>
