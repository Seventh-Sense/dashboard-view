<template>
  <div
    class="container"
    :style="{
      width: w + 'px',
      height: h + 'px',
      backgroundColor: backgroundColor
    }"
  >
    <div
      class="container-left"
      :style="{
        fontSize: fontSize + 'px',
        color: textColor
      }"
    >
      {{ title }}
    </div>
    <div class="container-right">
      <img :width="rightIconSize" :height="rightIconSize" :src="SVG_ICON.card_icons.snow_TL" />
    </div>

    <div class="container-bottom">
      <div
        :style="{
          fontSize: dataSize + 'px',
          color: dataColor
        }"
      >
        {{ value }}
      </div>
      <div
        v-if="isUnit"
        :style="{
          fontSize: bottomTextSize + 'px',
          color: bottomTextColor
        }"
      >
        {{ unitText }}
      </div>
      <div
        v-if="isStatus"
        :style="{
          fontSize: bottomTextSize + 'px',
          color: bottomTextColor
        }"
      >
        状态
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch, toRefs, ref } from 'vue'
import { CreateComponentType } from '../../../../../packages/index.d'
import { useChartDataFetch } from '../../../../../hooks/useChartDataFetch.hook'
import { useChartEditStore } from '../../../../../store/modules/chartEditStore/chartEditStore'
import SVG_ICON from '../../../../../svg/SVG_ICON'
import { parseData } from '@/utils'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const value = ref<any>(35)

const option = shallowReactive({
  dataset: true
})

const {
  fontSize,
  backgroundColor,
  textColor,
  title,
  rightIconSize,
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
  position: relative;
  border: 1px solid transparent;
  border-radius: 16px;
  padding: 12px;

  &-left {
    position: absolute;
    top: 12px;
    left: 12px;
    text-align: left;
  }

  &-right {
    position: absolute;
    top: 12px;
    right: 12px;
    text-align: right;
  }

  &-bottom {
    position: absolute;
    left: 12px;
    bottom: 12px;
    display: flex;
    gap: 8px;
    align-items: flex-end;
  }
}
</style>
