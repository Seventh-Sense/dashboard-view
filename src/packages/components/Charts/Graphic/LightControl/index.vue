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
        style="margin-top: 12px; font-weight: bold"
        :style="{
          fontSize: top_title_size + 'px',
          color: top_title_color
        }"
      >
        {{ top_title }}
      </div>
      <n-image
        object-fit="fill"
        preview-disabled
        :src="value === on_contant ? on_url : off_url"
        :fallback-src="requireErrorImg()"
        :width="image_w"
        :height="image_h"
        lazy
      />
    </div>
    <div class="container-bottom">
      <div
        :style="{
          fontSize: tip_size + 'px',
          color: tip_color
        }"
      >
        {{ tip_content }}
      </div>
      <div
        class="container-bottom-switch"
        :style="{
          background: switch_bg_color,
          width: w - 24 + 'px',
          height: switch_h + 'px'
        }"
      >
        <div
          @click="onClick(1)"
          class="container-bottom-switch-item"
          :class="value === on_contant ? 'active' : 'inactive'"
        >
          {{ on_text }}
        </div>
        <div
          @click="onClick(0)"
          class="container-bottom-switch-item"
          :class="value === off_contant ? 'active' : 'inactive'"
        >
          {{ off_text }}
        </div>
      </div>
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

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const flag = ref(false)
const t = window['$t']

const value = ref<any>('0')

const {
  backgroundColor,
  top_title_size,
  top_title,
  top_title_color,
  tip_content,
  tip_color,
  tip_size,
  switch_h,
  switch_bg_color,
  active_color,
  inactive_color,
  active_bg_color,
  inactive_bg_color,
  on_text,
  off_text,
  on_contant,
  off_contant,
  on_url,
  off_url,
  image_w,
  image_h
} = toRefs(props.chartConfig.option)

const { w, h } = toRefs(props.chartConfig.attr)

const onClick = throttle(
  async (data: number) => {
    try {
      flag.value = true

      let tmp = cloneDeep(value.value)
      if (data === 0) {
        value.value = off_contant.value
      } else if (data === 1) {
        value.value = on_contant.value
      }
      //option.dataset = parseData(data, 'string')

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
      value.value = parseData(newVal, 'string')
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
  padding: 0 12px 12px 12px;

  &-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  &-bottom {
    display: flex;
    gap: 8px;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;

    &-switch {
      border-radius: 8px;
      display: flex;
      gap: 8px;
      justify-content: space-between;
      align-items: center;
      padding: 4px;

      &-item {
        flex: 1;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
  }
}

.active {
  background-color: v-bind('active_bg_color');
  color: v-bind('active_color');
}
.inactive {
  background-color: v-bind('inactive_bg_color');
  color: v-bind('inactive_color');
}
</style>
