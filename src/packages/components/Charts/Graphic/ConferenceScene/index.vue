<template>
  <div
    class="container"
    :style="{
      width: w + 'px',
      height: h + 'px',
      padding: padding + 'px'
    }"
  >
    <n-grid :x-gap="x_gap" :y-gap="y_gap" :cols="3">
      <n-grid-item v-for="mode in modes">
        <div
          @click="onClick(mode.value)"
          class="container-item"
          :style="{
            width: icon_w + 'px',
            height: icon_h + 'px',
            borderRadius: radius + 'px',
            backdropFilter: 'blur(' + filter + 'px)',
            backgroundColor: mode.value === value ? active_bgColor : inactive_bgColor
          }"
        >
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 16px;
            "
          >
            <Icon
              :name="mode.icon"
              type="color-white"
              :size="icon_size"
              :color="{ normal: 'white' }"
            />
            <div
              :style="{
                fontSize: title_size + 'px',
                color: title_color
              }"
            >
              {{ mode.title }}
            </div>
          </div>
        </div>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs, shallowReactive, ref, watch } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'
import { Icon } from '@/icon/index'
import { cloneDeep } from 'lodash'
import throttle from 'lodash/throttle'
import { throttleTime, updateNodeData } from '@/packages/public'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const t = window['$t']
const value = ref<any>('0')
const flag = ref(false)

const {
  inactive_bgColor,
  active_bgColor,
  icon_size,
  radius,
  filter,
  modes,
  x_gap,
  y_gap,
  padding,
  icon_w,
  icon_h,
  title_size,
  title_color
} = toRefs(props.chartConfig.option)

const { w, h } = toRefs(props.chartConfig.attr)

const onClick = throttle(
  async (data: any) => {
    try {
      flag.value = true
      
      let tmp = cloneDeep(value.value)

      value.value = parseData(data, 'string')

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
  background-color: transparent;

  &-item {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
</style>
