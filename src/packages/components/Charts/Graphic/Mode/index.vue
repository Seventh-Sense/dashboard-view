<template>
  <img
    v-if="option.dataset === modes[0]"
    width="96"
    height="96"
    :src="SVG_ICON.card_icons.snow"
    @click="onClick"
  />
  <img v-else width="96" height="96" :src="SVG_ICON.card_icons.sun" @click="onClick" />
</template>

<script setup lang="ts">
import SVG_ICON from '@/svg/SVG_ICON'
import { PropType, shallowReactive, watch, toRefs, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'
import throttle from 'lodash/throttle'
import { updatePoint } from '@/api/http'

const t = window['$t']

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const flag = ref(false)
const option = shallowReactive({
  dataset: '0'
})

const { modes } = toRefs(props.chartConfig.option)

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    option.dataset = parseData(newVal, 'string')
  },
  {
    immediate: true,
    deep: true
  }
)

const onClick = throttle(
  () => {
    click()
  },
  1000,
  {
    leading: true,
    trailing: false
  }
)

const click = () => {
  let params = props.chartConfig.request.bindParams

  let data = getData(option.dataset, modes.value)

  if (params.objectID !== '') {
    flag.value = true

    updatePoint(params.objectID, { value: Number(data) })
      .then((res: any) => {
        if (res.status === 'OK') {
          option.dataset = parseData(data, 'string')
          window['$message'].success(t('msg.gauge_msg_1'))
        } else {
          window['$message'].error(t('msg.gauge_msg_2'))
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        flag.value = false
      })
  } else {
    window['$message'].warning(t('msg.gauge_msg_3'))
  }
}

const getData = (value: string, options: string[]): string => {
  if (options.length === 0) return '' // 处理空数组情况

  const index = options.indexOf(value)
  if (index === -1) return options[0] // 未找到返回首项

  let nextIndex = index + 1

  // 核心逻辑调整：确保索引有效且符合业务规则
  nextIndex = nextIndex > 1 || nextIndex >= options.length ? 0 : nextIndex

  return options[nextIndex]
}
</script>

<style lang="scss" scoped></style>
