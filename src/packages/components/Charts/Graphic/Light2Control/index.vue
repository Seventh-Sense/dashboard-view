<template>
  <div
    class="container"
    :style="{
      width: w + 'px',
      height: h + 'px',
      backgroundColor: backgroundColor,
      borderRadius: radius + 'px',
      backdropFilter: 'blur(' + filter + 'px)'
    }"
  >
    <div class="container-top">
      <div
        style="font-weight: bold"
        :style="{
          fontSize: top_title_size + 'px',
          color: top_title_color
        }"
      >
        {{ top_title }}
      </div>
      <img
        v-if="value"
        style="cursor: pointer"
        :width="switch_w"
        :height="switch_h"
        @click="onClick"
        :src="SVG_ICON.card_icons.switch_on"
      />
      <img
        v-else
        style="cursor: pointer"
        :width="switch_w"
        :height="switch_h"
        @click="onClick"
        :src="SVG_ICON.card_icons.switch_off"
      />
    </div>
    <div v-if="image_switch" class="container-image">
      <n-image
        object-fit="fill"
        preview-disabled
        :src="value ? image_on : image_off"
        :fallback-src="requireErrorImg()"
        :width="image_w"
        :height="image_h"
        lazy
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, watch, toRefs, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'
import { requireErrorImg } from '@/utils'
import { throttleTime, updateNodeData } from '@/packages/public'
import { cloneDeep } from 'lodash'
import throttle from 'lodash/throttle'
import SVG_ICON from '@/svg/SVG_ICON'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const flag = ref(false)
const t = window['$t']

const value = ref<boolean>(false)

const {
  backgroundColor,
  radius,
  filter,
  top_title_size,
  top_title,
  top_title_color,
  switch_w,
  switch_h,
  image_switch,
  image_on,
  image_off,
  image_w,
  image_h
} = toRefs(props.chartConfig.option)

const { w, h } = toRefs(props.chartConfig.attr)

const onClick = throttle(
  async () => {
    try {
      flag.value = true

      let data = value.value ? 0 : 1

      let tmp = cloneDeep(value.value)

      value.value = parseData(data, 'boolean')

      let result = await updateNodeData(props.chartConfig?.request?.bindParams, Number(data))
      if (!result) {
        value.value = tmp
      }
    } catch (error) {
      // 错误已由 updateNodeData 处理，此处可补充额外逻辑
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
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid transparent;
  border-radius: 16px;
  padding: 12px;
  position: relative;

  &-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    z-index: 99;
  }

  &-image {
    position: absolute;
    top: 0px;
    right: 12px;
  }
}
</style>
