<template>
  <div class="contain">
    <img
      :width="w"
      :height="h"
      src="~@/assets/device/fan/VerticalPumpLeftBody.png"
      style="position: absolute"
    />
    <img
      :width="w"
      :height="h"
      src="~@/assets/device/fan/VerticalPumpLeftBaseFlenge.png"
      style="position: absolute"
    />
    <img :width="w" :height="h" :src="currentImage" style="position: absolute" />
  </div>
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch, toRefs, ref, onMounted } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { useChartDataFetch } from '@/hooks/useChartDataFetch.hook'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import CCW_01 from '@/assets/device/fan/VerticalPumpLeftImpeller-CCW_01.png'
import CCW_02 from '@/assets/device/fan/VerticalPumpLeftImpeller-CCW_02.png'
import CCW_03 from '@/assets/device/fan/VerticalPumpLeftImpeller-CCW_03.png'
import { getType } from '@/utils/utils'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { w, h } = toRefs(props.chartConfig.attr)
const option = shallowReactive({
  dataset: true
})

const currentImage = ref(CCW_01)
let currenIndex = 0
let interval: any = null

const images = [CCW_01, CCW_02, CCW_03]

function circularIndex(array: any[], index: number) {
  const length = array.length
  return (index + 1) % length
}

const processAnimation = () => {
  if (interval) {
    return
  }

  interval = setInterval(() => {
    currenIndex = circularIndex(images, currenIndex)
    currentImage.value = images[currenIndex]

  }, 100)
}

const clear = () => {
  if (interval) {
    clearInterval(interval)
  }
}

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    let type = getType(newVal)
    //console.log('MotorDevice value', type, newVal)
    
    if (type === 'string') {
      let val = parseFloat(newVal)
      if (val > 0) {
        processAnimation()
      } else {
        clear()
      }
      //if (va)
    } else if (type === 'boolean') {
      if (newVal) {
        processAnimation()
      } else {
        clear()
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
)





useChartDataFetch(props.chartConfig, useChartEditStore, (newVal: string | number) => {
  // @ts-ignore
  option.dataset = newVal
})
</script>

<style lang="scss" scoped>
.contain {
  position: relative;
}
</style>
