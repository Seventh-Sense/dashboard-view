<template>
  <!-- <GoSwitch v-model="value" :width="`${w}px`" :height="`${h}px`" @change="onClick" /> -->
  <img v-if="value" style="cursor: pointer" @click="onClick" :src="SVG_ICON.card_icons.switch_on" />
  <img v-else style="cursor: pointer" @click="onClick" :src="SVG_ICON.card_icons.switch_off" />
</template>

<script setup lang="ts">
import { PropType, toRefs, shallowReactive, watch, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'
import { GoSwitch } from '@/components/GoSwitch'
import throttle from 'lodash/throttle'
import { throttleTime, updateNodeData } from '@/packages/public'
import { cloneDeep } from 'lodash'
import SVG_ICON from '@/svg/SVG_ICON'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})
const t = window['$t']
//更新期间，不修改值
const flag = ref(false)

const { w, h } = toRefs(props.chartConfig.attr)
const option = shallowReactive({
  dataset: false
})

const value = ref(false)

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    if (!flag.value) {
      value.value = parseData(newVal, 'boolean')
    }
  },
  {
    immediate: true,
    deep: true
  }
)

const onClick = throttle(
  async () => {
    try {
      flag.value = true
      
      let data = value.value ? 0 : 1

      let tmp = cloneDeep(value.value)
      value.value = parseData(data, 'boolean')

      //console.log('eeee', value.value)
      let result = await updateNodeData(props.chartConfig?.request?.bindParams, Number(data))
      if (!result) {
        value.value = tmp
      }
    } catch (error) {
      console.error('操作失败:', error)
    } finally {
      flag.value = false
    }
  },
  throttleTime,
  {
    leading: true,
    trailing: false
  }
)
</script>

<style lang="scss" scoped></style>
