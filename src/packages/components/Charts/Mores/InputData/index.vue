<template>
  <div v-if="isShow" class="container">
    <n-input-number v-model:value="input_value" size="large" :show-button="showbutton" clearable />
    <Icon
      name="checkmark"
      type="mono-line"
      :size="32"
      :color="{ normal: icon_color }"
      @click="onSubmit"
    />
    <Icon
      name="dismiss"
      type="mono-line"
      :size="32"
      :color="{ normal: icon_color }"
      @click="onCancel"
    />
  </div>
  <div
    v-else
    @click="onOpen"
    class="datatext"
    :style="{
      color: color,
      fontSize: size + 'px'
    }"
  >
    {{ fixedByDecimal(value) }}
  </div>
</template>

<script setup lang="ts">
import { PropType, watch, toRefs, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'
import { Icon } from '@/icon/index'
import { updateNodeData } from '@/packages/public'
import { cloneDeep } from 'lodash'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const isShow = ref(false)
const flag = ref(false)
const value = ref<number>(35)

const input_value = ref(35)

const { w, h } = toRefs(props.chartConfig.attr)

const { showbutton, icon_color, color, size, decimal } = toRefs(props.chartConfig.option)

const onSubmit = async () => {
  try {
    flag.value = true
    let data = input_value.value

    let tmp = cloneDeep(value.value)
    value.value = parseData(data, 'number')

    let result = await updateNodeData(props.chartConfig?.request?.bindParams, Number(data))
    if (!result) {
      value.value = tmp
    }
  } catch (error) {
    console.error('操作失败:', error)
  } finally {
    isShow.value = false
    flag.value = false
  }
}

const onCancel = () => {
  isShow.value = false
}

const onOpen = () => {
  input_value.value = value.value
  isShow.value = true
}

function fixedByDecimal(num: any) {
  if (decimal.value === 0) {
    return Number(num).toFixed()
  } else {
    return Number(num).toFixed(decimal.value)
  }
}

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    if (!flag.value) {
      value.value = parseData(newVal, 'number')
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
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
}

.datatext {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
