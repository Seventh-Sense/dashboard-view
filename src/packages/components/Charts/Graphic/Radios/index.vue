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
      class="radios"
      :style="{
        height: h + 'px'
      }"
    >
      <div
        v-for="mode in modes"
        class="radios-item"
        :key="mode.key"
        @click="onClick(mode.value)"
        :class="option.dataset === mode.value ? 'active' : 'inactive'"
      >
        {{ mode.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs, shallowReactive, watch, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'
import { cloneDeep } from 'lodash-es'
import throttle from 'lodash/throttle'
import { throttleTime, updateNodeData } from '@/packages/public'

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
  inactive_bg_color,
  active_bg_color,
  modes,
  title_switch,
  title_text,
  title_size,
  title_color
} = toRefs(props.chartConfig.option)

const { w, h } = toRefs(props.chartConfig.attr)
const option = shallowReactive({
  dataset: false
})

const onClick = throttle(
  async (data: number) => {
    try {
      flag.value = true

      let tmp = cloneDeep(option.dataset)
      option.dataset = parseData(data, 'number')

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
      option.dataset = parseData(newVal, 'number')
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

.radios {
  background-color: v-bind('background');
  padding: 4px;
  display: flex;
  flex: 1;
  justify-content: space-between;
  gap: 8px;

  &-item {
    flex: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 8px;
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
