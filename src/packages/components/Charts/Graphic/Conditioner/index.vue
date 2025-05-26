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
          fontSize: titleSize + 'px',
          color: titleColor
        }"
      >
        {{ title }}
      </div>
      <n-switch v-model:value="onOff" />
    </div>
    <div class="container-icon">
      <img :width="32" :height="32" :src="SVG_ICON.card_icons.snow_TL" />

      <img :width="32" :height="32" :src="SVG_ICON.card_icons.snow_TL" />
    </div>
    <div>
      {{ value }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, watch, toRefs, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import SVG_ICON from '@/svg/SVG_ICON'
import { parseData } from '@/utils'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { backgroundColor, title, titleColor, titleSize } = toRefs(props.chartConfig.option)

const { w, h } = toRefs(props.chartConfig.attr)

const value = ref<any>(35)
const onOff = ref<boolean>(false)
const setValue = ref<any>(35)
const mode = ref<any>(1)
const speed = ref<any>(1)

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
</script>

<style lang="scss" scoped>
.container {
  border: 1px solid transparent;
  border-radius: 16px;
  padding: 12px;

  &-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-icon {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
  }
  &-left {
  }

  &-right {
  }
}
</style>
