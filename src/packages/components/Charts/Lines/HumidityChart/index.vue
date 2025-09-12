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
        <Icon name="temperature" :size="rightIconSize" />
      </div>
    </div>

    <div class="container-bottom">
      <div>
        <span
          class="container-value"
          :style="{
            fontSize: dataSize + 'px',
            color: dataColor,
            lineHeight: dataSize + 'px'
          }"
        >
          {{ fixedByDecimal(value) }}
        </span>
        <span
          :style="{
            fontSize: bottomTextSize + 'px',
            color: bottomTextColor,
            lineHeight: bottomTextColor + 'px'
          }"
        >
          {{ unitText }}
        </span>
      </div>
      <n-progress
        type="line"
        :percentage="p_value"
        :show-indicator="false"
        :color="'rgba(111,110,250,1)'"
        processing
      />
      <div style="display: flex; justify-content: space-between; width: 100%">
        <span
          :style="{
            color: textColor
          }"
        >
          {{ min }}
        </span>
        <span
          :style="{
            color: textColor
          }"
        >
          {{ max }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch, toRefs, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { Icon } from '@/icon/index'
import { parseData } from '@/utils'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { w, h } = toRefs(props.chartConfig.attr)

const value = ref<any>(80)

//进度条值
const p_value = ref<any>(80)

const {
  fontSize,
  backgroundColor,
  textColor,
  title,
  rightIconSize,
  min,
  max,
  dataSize,
  dataColor,
  unitText,
  bottomTextSize,
  bottomTextColor,
  decimal,
} = toRefs(props.chartConfig.option)

function fixedByDecimal(num: any) {
  if (decimal.value === 0) {
    return Number(num).toFixed()
  } else {
    return Number(num).toFixed(decimal.value)
  }
}

const dataHandle = (newData: any) => {
  let range = max.value - min.value
  p_value.value = (Math.abs(min.value - newData) * 100) / range
}

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    value.value = parseData(newVal, 'number')
    dataHandle(value.value)
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 12px 12px 0 12px;

  &-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  &-bottom {
    display: flex;
    justify-content: flex-start;

    flex-direction: column;
  }

  &-value {
    font-weight: bold;
  }
}

</style>
