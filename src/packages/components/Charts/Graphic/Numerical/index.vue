<template>
  <div
    class="container"
    :style="{
      width: w + 'px',
      height: h + 'px',
      backgroundColor: backgroundColor
    }"
  >
    <div class="container-top">
      <div
        :style="{
          fontSize: fontSize + 'px',
          color: textColor
        }"
      >
        {{ title }}
      </div>
      <div>
        <Icon v-if="iconNo === 1" name="temperature" :size="72" :color="{ normal: '#3399ff' }" />
        <Icon v-else-if="iconNo === 2" name="humidity" :size="72" :color="{ normal: '#3399ff' }" />
      </div>
    </div>

    <div class="container-bottom">
      <div
        :style="{
          fontSize: dataSize + 'px',
          color: dataColor,
          lineHeight: dataSize + 'px'
        }"
      >
        {{ value }}
      </div>
      <div
        v-if="isUnit"
        :style="{
          fontSize: bottomTextSize + 'px',
          color: bottomTextColor,
          lineHeight: bottomTextColor + 'px'
        }"
      >
        {{ unitText }}
      </div>
      <div
        v-if="isStatus"
        :style="{
          fontSize: bottomTextSize + 'px',
          color: bottomTextColor,
          lineHeight: bottomTextColor + 'px'
        }"
      >
        状态
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch, toRefs, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { useChartDataFetch } from '@/hooks/useChartDataFetch.hook'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { parseData } from '@/utils'
import { Icon } from '@/icon/index'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const value = ref<any>(26)

const option = shallowReactive({
  dataset: 26
})

const {
  fontSize,
  backgroundColor,
  textColor,
  title,
  rightIconSize,
  iconNo,
  dataSize,
  dataColor,
  unitText,
  bottomTextSize,
  bottomTextColor,
  isUnit,
  isStatus
} = toRefs(props.chartConfig.option)

const { w, h } = toRefs(props.chartConfig.attr)

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    value.value = parseData(newVal, 'number')
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
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid transparent;
  border-radius: 16px;
  padding: 12px 0 12px 12px;

  &-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  &-bottom {
    display: flex;
    gap: 8px;
    justify-content: flex-start;
    align-items: flex-end;
  }
}
</style>
