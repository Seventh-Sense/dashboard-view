<template>
  <div>
    <n-tabs type="line" animated>
      <n-tab-pane name="oasis" :tab="$t('device.detail')">
        {{ $t('device.detail') }}
      </n-tab-pane>
      <n-tab-pane name="the beatles" :tab="$t('device.object_list')">
        <ObjectList />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import { DeviceList } from '@/page/untils/type'
import { ObjectList } from '@/page/ObjectManage/RemoteObject/components/ObjectList'

const useDeviceInfo: any = inject('deviceInfo')

onMounted(() => {
  console.log(useDeviceInfo.value)
})
</script>

<style lang="scss" scoped></style>
