<template>
  <div class="container">
    <div
      v-if="title_switch"
      :style="{
        fontSize: title_size + 'px',
        color: title_color
      }"
    >
      {{ title_text }}
    </div>
    <div
      class="radio"
      :style="{
        height: h + 'px'
      }"
    >
      <div
        class="radio-item"
        @click="onClick(on_contant)"
        :style="{
          fontSize: font_size + 'px',
          backgroundColor: option.dataset === on_contant ? active_bg_color : inactive_bg_color,
          color: option.dataset === on_contant ? active_color : inactive_color
        }"
      >
        {{ on_text }}
      </div>
      <div
        class="radio-item"
        @click="onClick(off_contant)"
        :style="{
          fontSize: font_size + 'px',
          backgroundColor: option.dataset === off_contant ? active_bg_color : inactive_bg_color,
          color: option.dataset === off_contant ? active_color : inactive_color
        }"
      >
        {{ off_text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs, shallowReactive, watch, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'
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

const {
  background,
  active_color,
  inactive_color,
  on_text,
  on_contant,
  off_text,
  off_contant,
  font_size,
  inactive_bg_color,
  active_bg_color,
  title_switch,
  title_text,
  title_size,
  title_color
} = toRefs(props.chartConfig.option)

const option = shallowReactive({
  dataset: '0'
})

const { w, h } = toRefs(props.chartConfig.attr)

const onClick = throttle(
  async (data: any) => {
    try {
      flag.value = true

      let tmp = cloneDeep(option.dataset)

      option.dataset = data
      //option.dataset = parseData(data, 'string')

      let result = await updateNodeData(props.chartConfig?.request?.bindParams, Number(data))
      if (!result) {
        option.dataset = tmp
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
      option.dataset = parseData(newVal, 'string')
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
  justify-items: flex-start;
  align-items: center;
  gap: 12px;
}

.radio {
  background-color: v-bind('background');
  padding: 4px;
  flex: 1;
  display: flex;
  gap: 8px;

  &-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 8px;
  }
}
</style>
