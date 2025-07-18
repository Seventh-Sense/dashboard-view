<template>
  <div
    class="container"
    :style="{
      width: w + 'px',
      height: h + 'px'
    }"
  >
    <div v-for="(mode, index) in modes" :key="index" class="container-item">
      <div
        class="container-icon"
        :style="{
          width: icon_size + 'px',
          height: icon_size + 'px',
          background: icon_bottom_color,
          borderColor: border_color
        }"
        @click="onClick(mode.value)"
      >
        <Icon v-if="value === mode.value" :name="mode.icon" :size="(icon_size / 5) * 3" />
        <Icon
          v-else
          :name="mode.icon"
          type="mono-line"
          :size="(icon_size / 5) * 3"
          :color="{ normal: 'white' }"
        />
      </div>
      <div class="container-title" :style="{ color: title_color, fontSize: title_size + 'px' }">
        {{ mode.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, watch, toRefs, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'
import { Icon } from '@/icon/index'
import throttle from 'lodash/throttle'
import { updateNodeData, throttleTime } from '@/packages/public'
import cloneDeep from 'lodash/cloneDeep'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const flag = ref(false)
const t = window['$t']

const value = ref<string>('0')

const { modes, title_size, title_color, icon_size, icon_bottom_color, border_color } = toRefs(
  props.chartConfig.option
)

const { w, h } = toRefs(props.chartConfig.attr)

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
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  padding: 0 12px;

  &-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  &-title {
    font-weight: 400;
  }

  &-icon {
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.13);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
