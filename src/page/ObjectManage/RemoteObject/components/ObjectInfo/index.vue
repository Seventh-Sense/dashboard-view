<template>
  <div>
    <n-tabs type="line" animated>
      <n-tab-pane name="oasis" :tab="$t('device.detail')">
        {{ $t('device.object_msg') }}
      </n-tab-pane>
      <n-tab-pane name="the beatles" :tab="$t('device.detail')">
        
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'

const useDeviceInfo: any = inject('deviceInfo')

onMounted(() => {
  console.log(useDeviceInfo.value)
})
</script>

<style lang="scss" scoped>
</style>
