<template>
  <div v-if="isShow" class="go-chart-configurations-data">
    <setting-item-box :name="$t('dashboard.devices')" :alone="true">
      <n-select
        size="small"
        v-model:value="deviceID"
        placeholder=""
        :options="deviceOptions"
        style="width: 260px"
        clearable
      />
    </setting-item-box>
    <setting-item-box :name="$t('dashboard.point')" :alone="true">
      <n-select
        size="small"
        v-model:value="pointID"
        placeholder=""
        :options="pointOptions"
        @update:value="bindValue"
        style="width: 260px"
        clearable
        :render-label="renderLabel"
      />
    </setting-item-box>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, h, watch } from 'vue'
import { useTargetData } from '../hooks/useTargetData.hook'
import { SettingItemBox } from '@/components/Pages/ChartItemSetting'
import { getDeviceList, readPointValue, readSubscribePoints } from '@/api/http'
import { NTooltip } from 'naive-ui'

const { targetData } = useTargetData()

const deviceID = ref('')
const deviceType = ref('')
const deviceAddress = ref('')
const pointID = ref('')

const deviceOptions = ref<any>([])
const pointOptions = ref<any>([])

const isShow = ref(false)

const bindValue = (value: any) => {
  // 读取选取点位的"priorityArray"
  
  if (deviceType.value === 'bacnet') {
    let defaultPriority = 8 // 默认优先级
    
    const fetchPriority = async () => {
      try {
        const res = await readPointValue(deviceID.value)

        if (!res.data?.length) return defaultPriority

        const point = res.data.find((item: any) => item.metric_id === value)
        if (!point) return defaultPriority

        const priorityArray = point.property['priority-array']
        if (!priorityArray) return defaultPriority

        // 使用Object.entries简化查找逻辑
        const validPriority = Object.entries(priorityArray).find(([_, val]) => val !== null)

        return validPriority ? Number(validPriority[0]) : defaultPriority
      } catch (error) {
        console.error('Error fetching priority:', error)
        return defaultPriority
      }
    }

    // 立即执行异步函数
    fetchPriority().then(priority => {
      //console.log('priority', priority)
      let uid = pointOptions.value.find((item: any) => item.value === value)?.uid || ''

      targetData.value.request.bindParams = {
        deviceID: deviceID.value,
        deviceName: '',
        deviceType: deviceType.value,
        deviceAddress: deviceAddress.value,
        objectID: value,
        objectName: '',
        objectPriority: priority,
        objectUid: uid
      }
    })
  } else {
    // 非bacnet情况的设置
    targetData.value.request.bindParams = {
      deviceID: deviceID.value,
      deviceName: '',
      deviceType: deviceType.value,
      objectID: value,
      objectName: '',
      objectPriority: 16
    }
  }
}

const renderLabel = (option: any) => {
  return h(
    NTooltip,
    { placement: 'top-start', trigger: 'hover' },
    {
      trigger: () => h('span', { class: 'truncated-text' }, option.label),
      default: () => option.label
    }
  )
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
    console.log('readDevices', res.data)

    res.data.map((device: any) => {
      deviceOptions.value.push({
        label: device.name,
        value: device.id,
        type: device.protocol,
        address: device.address
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
    //debugger
    if (newVal !== '' && newVal !== null) {
      //set type
      deviceType.value = deviceOptions.value.find((item: any) => item.value === newVal)?.type || ''
      deviceAddress.value =
        deviceOptions.value.find((item: any) => item.value === newVal)?.address || ''

      pointOptions.value = []
      readSubscribePoints(newVal)
        .then((res: any) => {
          console.log('readSubscribePoints', res.data)
          if (res.status && res.status === 'OK') {
            res.data.map((point: any) => {
              pointOptions.value.push({
                label: point.name,
                value: point.id,
                uid: point.uid
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
