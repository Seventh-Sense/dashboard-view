<template>
  <div v-if="isShow" class="go-chart-configurations-data">
    <setting-item-box :name="$t('dashboard.devices')" :alone="true">
      <n-select size="small" v-model:value="deviceID" placeholder="" :options="deviceOptions" />
    </setting-item-box>
    <setting-item-box :name="$t('dashboard.point')" :alone="true">
      <n-select
        size="small"
        v-model:value="pointID"
        placeholder=""
        :options="pointOptions"
        @update:value="bindValue"
      />
    </setting-item-box>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useTargetData } from '../hooks/useTargetData.hook'
import { CascaderOption } from 'naive-ui'
import { SettingItemBox } from '@/components/Pages/ChartItemSetting'
import { getDeviceList, readSubscribePoints } from '@/api/http'

const { targetData } = useTargetData()

const deviceID = ref('')
const pointID = ref('')

const deviceOptions = ref<any>([])
const pointOptions = ref<any>([])

const options: any = ref([])
const isShow = ref(false)

const bindValue = (value: any) => {
  //console.log('aaaaaa', value)
  targetData.value.request.bindParams = {
    deviceID: deviceID.value,
    deviceName: '',
    objectID: value,
    objectName: ''
  }
}

onMounted(() => {
  readDevices()
})

const readDevices = async () => {
  try {
    const res: any = await getDeviceList()

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      return
    }

    res.data.map((device: any) => {
      deviceOptions.value.push({
        label: device.name,
        value: device.id
      })
    })

    //console.log('readDevices', deviceOptions.value)
  } catch (error) {
    console.log('readDevices', error)
  }
}

//判断绑定数据是否显示
const bindDataDisplay = (data: any) => {
  let flag = false

  isShow.value = false
  let classType = data.chartConfig.package

  if (classType === 'Charts') {
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

      //console.log('targetData.value', newVal.request.bindParams)
      if (newVal.request.bindParams) {
        deviceID.value = newVal.request.bindParams.deviceID
        pointID.value = newVal.request.bindParams.objectID
      }
    }
  },
  { deep: true, immediate: true }
)

watch(
  () => deviceID.value,
  newVal => {
    if (newVal !== '') {
      pointOptions.value = []
      readSubscribePoints(newVal)
        .then((res: any) => {
          //console.log('readSubscribePoints', res.data)
          if (res.status === 'OK') {
            res.data.map((point: any) => {
              pointOptions.value.push({
                label: point.name,
                value: point.id
              })
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped></style>
