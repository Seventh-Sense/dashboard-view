<template>
  <div class="go-chart-configurations-data">
    <setting-item-box :name="$t('dashboard.point_bind')" :alone="true">
      <n-cascader
        size="small"
        v-model:value="value"
        placeholder=""
        expand-trigger="click"
        check-strategy="child"
        :options="options"
        @update:value="handleUpdateValue"
        :clearable="true"
      />
    </setting-item-box>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useTargetData } from '../hooks/useTargetData.hook'
import { CascaderOption } from 'naive-ui'
import { SettingItemBox } from '@/components/Pages/ChartItemSetting'
import { readDeivceList } from '@/api/http'
import { nanoid } from 'nanoid'

const { targetData } = useTargetData()
const value = computed(() => {
  let initData = targetData.value.request.bindParams

  return initData.deviceName + '-' + initData.deviceID + '-' + initData.objectID
})
const options: any = ref([])

const handleUpdateValue = (value: string, option: CascaderOption) => {
  let array = value.split('-')
  targetData.value.request.bindParams = {
    deviceID: array[1],
    deviceName: array[0],
    objectID: array[2],
    objectName: option.label
  }
  //console.log(targetData.value)
}

onMounted(() => {
  console.log(targetData.value)

  readDeivceList()
    .then(data => {
      if (data !== undefined) {
        dataConversion(data)
      } else {
        console.log('no list')
      }
    })
    .catch(error => {
      console.log(error)
    })
})

const dataConversion = (data: any) => {
  if (data.devices && data.devices.length > 0) {
    data.devices.map((device: any) => {
      let children: Array<any> = []
      if (device.attributes.length > 0) {
        device.attributes.map((attr: any) => {
          children.push({
            label: attr.name,
            value: device.name + '-' + device.id + '-' + attr.id
          })
        })
      }

      options.value.push({
        label: device.name,
        value: device.id,
        children: children
      })
    })
  }

  console.log(options.value)
}
</script>

<style lang="scss" scoped></style>
