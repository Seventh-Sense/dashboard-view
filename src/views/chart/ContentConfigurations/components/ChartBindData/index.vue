<template>
  <div v-if="isShow" class="go-chart-configurations-data">
    <setting-item-box :name="$t('dashboard.point')" :alone="true">
      <n-cascader
        v-model:value="value"
        :options="options"
        check-strategy="child"
        size="small"
        @update:value="handleUpdateValue"
      />
    </setting-item-box>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, h, watch } from 'vue'
import { useTargetData } from '../hooks/useTargetData.hook'
import { SettingItemBox } from '@/components/Pages/ChartItemSetting'
import { getLocalStorage } from '@/utils'
import { useRoute } from 'vue-router'

const { targetData } = useTargetData()

const routerParamsInfo = useRoute()

const isShow = ref(false)

const value = ref<any>(null)
const options = ref<any[]>([])

onMounted(() => {
  getOptions()
})

const getOptions = () => {
  const controllerInfo = getLocalStorage('controllerState')
  if (!controllerInfo) {
    return
  }

  const { id } = routerParamsInfo.params
  const ip = typeof id === 'string' ? '' : id[1] || ''

  const devices = controllerInfo.controllerMap[ip]?.devices ?? []
  if (!devices.length) return

  options.value = devices.map((device: any) => ({
    label: device.device_name,
    value: device.uid,
    children: device.points.map((point: any) => ({
      value: point.uid,
      label: point.point_name,
      deviceUid: device.uid,
      deviceName: device.device_name
    }))
  }))
}

const handleUpdateValue = (pointUid: string, selectedOptions: any) => {
  //console.log(pointUid, selectedOptions)
  //记录点位uid，和设备uid
  targetData.value.request.bindParams = {
    deviceID: selectedOptions.deviceUid,
    objectID: pointUid
  }
}

//判断绑定数据是否显示
const bindDataDisplay = (data: any) => {
  //console.log('bindDataDisplay', data)
  let flag = false

  isShow.value = false
  let classType = data.chartConfig.package

  //console.log('data.chartConfig', data.chartConfig)
  if (classType === 'Charts' || data.chartConfig.key === 'Image') {
    flag = true
    isShow.value = true
  }

  return flag
}

watch(
  () => targetData.value,
  newVal => {
    //判断绑定数据是否显示
    if (newVal && newVal.chartConfig) {
      bindDataDisplay(newVal)

      if (newVal.request.bindParams) {
        // deviceID.value = newVal.request.bindParams.deviceID
        // pointID.value = newVal.request.bindParams.objectID
        value.value = newVal.request.bindParams.objectID
      }
    }
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss" scoped></style>
