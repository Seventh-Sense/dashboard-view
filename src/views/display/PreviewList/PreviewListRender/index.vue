<template>
  <div
    class="chart-item"
    :id="item.id"
    v-for="(item, index) in chartData.componentList"
    :class="animationsClass(item.styles.animations)"
    :key="item.id"
    :style="{
      ...getComponentAttrStyle(item.attr, index),
      ...getTransformStyle(item.styles),
      ...getStatusStyle(item.status),
      ...getPreviewConfigStyle(item.preview),
      ...getBlendModeStyle(item.styles) as any,
      ...getSizeStyle(item.attr)
    }"
  >
    <!-- 分组 -->
    <PreviewRenderGroup
      v-if="item.isGroup"
      :groupData="(item as CreateComponentGroupType)"
      :groupIndex="index"
      :themeSetting="themeSetting"
      :themeColor="themeColor"
    />

    <!-- 单组件 -->
    <component
      v-else
      :is="item.chartConfig.chartKey"
      :id="item.id"
      :chartConfig="item"
      :themeSetting="themeSetting"
      :themeColor="themeColor"
      :style="{
        ...getSizeStyle(item.attr),
        ...getFilterStyle(item.styles)
      }"
      v-on="useLifeHandler(item)"
    ></component>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, onMounted } from 'vue'
import { animationsClass, getFilterStyle, getTransformStyle, getBlendModeStyle, colorCustomMerge } from '@/utils'
import { getSizeStyle, getComponentAttrStyle, getStatusStyle, getPreviewConfigStyle } from '@/views/preview/utils'
import { CreateComponentGroupType } from '@/packages/index.d'
import { ChartEditStorageType } from '@/views/preview/utils'
import { useLifeHandler } from '@/hooks'
import { PreviewRenderGroup } from '@/views/preview/components/PreviewRenderGroup'

const props = defineProps({
  chartData: {
    type: Object as PropType<ChartEditStorageType>,
    required: true
  }
})

// 主题色
const themeSetting = computed(() => {
  const chartThemeSetting = props.chartData.editCanvasConfig.chartThemeSetting
  return chartThemeSetting
})

// 配置项
const themeColor = computed(() => {
  const colorCustomMergeData = colorCustomMerge(props.chartData.editCanvasConfig.chartCustomThemeColorInfo)
  return colorCustomMergeData[props.chartData.editCanvasConfig.chartThemeColor]
})
</script>

<style lang="scss" scoped>
.chart-item {
  position: absolute;
}
</style>
