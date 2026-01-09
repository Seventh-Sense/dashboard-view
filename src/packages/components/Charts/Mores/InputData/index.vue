<template>
  <div v-if="isShow" class="container" style="width: 200px; height: 32px">
    <n-config-provider :theme="is_dark ? darkTheme : lightTheme">
      <n-input-number
        v-model:value="input_value"
        size="large"
        style="width: 100px"
        :precision="decimal"
        :show-button="showbutton"
      />
    </n-config-provider>

    <div class="icon-group">
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
  </div>
  <div
    v-else
    @click="onOpen"
    class="datatext"
    :style="{
      width: w + 'px',
      height: h + 'px',
      color: color,
      fontSize: size + 'px',
      borderStyle: is_border ? 'solid' : 'none',
      borderWidth: border_width + 'px',
      borderColor: border_color
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
import { darkTheme, lightTheme } from 'naive-ui'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { w, h } = toRefs(props.chartConfig.attr)

const {
  is_edit,
  is_dark,
  is_border,
  showbutton,
  icon_color,
  color,
  size,
  decimal,
  border_width,
  border_color
} = toRefs(props.chartConfig.option)

const isShow = ref(false)
const flag = ref(false)
const value = ref<number>(0)

const input_value = ref(0)

const onSubmit = async () => {
  try {
    flag.value = true
    let data = input_value.value

    let tmp = cloneDeep(value.value)
    value.value = parseData(data, 'number')

    let result = await updateNodeData(props.chartConfig?.request, Number(data))
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
      if (newVal !== null) {
        value.value = parseData(newVal, 'number')
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
)

watch(
  () => props.chartConfig.option.is_edit,
  newVal => {
    console.log('is_edit changed:', w.value, h.value, newVal)
    if (newVal === true) {
      isShow.value = true
    } else {
      isShow.value = false
    }
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  position: relative;
  padding-right: 0;
}

.icon-group {
  position: absolute;
  /* 核心调整：紧贴输入框右侧外沿（0px是贴边，正数是远离，负数是重叠） */
  right: 0;
  /* 向右偏移的距离（控制图标在框外的距离，可自定义） */

  /* 垂直居中，和输入框完全对齐 */
  top: 50%;
  transform: translateY(-50%) translateX(v-bind(' (-w + 170) + "px" '));
  /* 图标横向排列，间距适中 */
  display: flex;
  gap: 4px;
  /* 确保点击优先级 */
  pointer-events: auto;
  /* 可选：给图标加鼠标悬浮效果 */
  cursor: pointer;
}

.datatext {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

::v-deep(.n-input) {
  border: 1px solid #222222FF !important;
}
</style>
