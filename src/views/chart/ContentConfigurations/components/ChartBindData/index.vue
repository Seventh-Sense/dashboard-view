<template>
  <div class="go-chart-configurations-data">
    <setting-item-box :name="$t('dashboard.point')" :alone="true">
      <n-cascader
        size="small"
        v-model:value="value"
        placeholder=""
        expand-trigger="click"
        check-strategy="child"
        :options="options"
        @update:value="handleUpdateValue"
        :clearable="true"
        placement="bottom-end"
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
  //mconsole.log(value, option)
  if (value === null) {
    targetData.value.request.bindParams = {
      deviceID: "",
      deviceName: "",
      objectID: "",
      objectName: ""
    }
  } else {
    let array = value.split('-')
    targetData.value.request.bindParams = {
      deviceID: array[1],
      deviceName: array[0],
      objectID: array[2],
      objectName: option.label
    }
  }
}

onMounted(() => {
  //console.log(targetData.value)
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
  if (data.length > 0) {
    data.map((device: any) => {
      let children: Array<any> = []
      if (device.points.length > 0) {
        device.points.map((attr: any) => {
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
