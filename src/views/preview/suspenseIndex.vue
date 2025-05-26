<template>
  <div
    :class="`go-preview ${chartEditStore.editCanvasConfig.previewScaleType}`"
    @mousedown="dragCanvas"
  >
    <template v-if="showEntity">
      <!-- 实体区域 -->
      <div ref="entityRef" class="go-preview-entity">
        <!-- 缩放层 -->
        <div ref="previewRef" class="go-preview-scale">
          <!-- 展示层 -->
          <div :style="previewRefStyle" v-if="show">
            <!-- 渲染层 -->
            <preview-render-list></preview-render-list>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- 缩放层 -->
      <div ref="previewRef" class="go-preview-scale">
        <!-- 展示层 -->
        <div :style="previewRefStyle" v-if="show">
          <!-- 渲染层 -->
          <preview-render-list></preview-render-list>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { PreviewRenderList } from './components/PreviewRenderList'
import { getFilterStyle, setTitle } from '@/utils'
import {
  getEditCanvasConfigStyle,
  getSessionStorageInfo,
  getPreviewInfo,
  keyRecordHandle,
  dragCanvas
} from './utils'
import { useComInstall } from './hooks/useComInstall.hook'
import { useScale } from './hooks/useScale.hook'
import { useStore } from './hooks/useStore.hook'
import { PreviewScaleEnum } from '@/enums/styleEnum'
import type { ChartEditStorageType } from './index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { readPointsDataById } from '@/api/http'

const t = window['$t']

await getSessionStorageInfo()
const chartEditStore = useChartEditStore() as unknown as ChartEditStorageType

setTitle(`${t('global.r_preview')}-${chartEditStore.editCanvasConfig.projectName}`)

const previewRefStyle = computed(() => {
  return {
    overflow: 'hidden',
    ...getEditCanvasConfigStyle(chartEditStore.editCanvasConfig),
    ...getFilterStyle(chartEditStore.editCanvasConfig)
  }
})

let interval: number | null = null

//适配方式的配置
const showEntity = computed(() => {
  const type = chartEditStore.editCanvasConfig.previewScaleType
  return type === PreviewScaleEnum.SCROLL_Y || type === PreviewScaleEnum.SCROLL_X
})

useStore(chartEditStore)
const { entityRef, previewRef } = useScale(chartEditStore)
//加载显示的组件
const { show } = useComInstall(chartEditStore)

// 开启键盘监听
keyRecordHandle()

const writeValue = (data: any) => {
  chartEditStore.componentList.map((component: any) => {
    const { deviceID, objectID } = component.request.bindParams

    const matchedData = data.find((item: any) => item.metric_id === objectID)

    if (!matchedData) return

    //console.log(matchedData.property?.['present-value'])
    component.option.dataset =
      component.key === 'Online' ? matchedData.status : matchedData.value
  })
}

onMounted(() => {
  console.log('chartEditStore', chartEditStore.editCanvasConfig)
  readPointValue(chartEditStore.componentList)
})

onUnmounted(() => {
  if (interval) {
    window.clearInterval(interval)
  }
})

const readPointValue = (dataList: any[]) => {
  let load = getAllDataIdsSafe(dataList)
  interval = window.setInterval(() => {
    readPointsDataById(load)
      .then((res: any) => {
        if (res.status === 'OK') {
          writeValue(res.data)
        } else {
          console.log('no data!')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, 3000)
}

//获取所有需要读取数据的点位
const getAllDataIdsSafe = (points: any[]): string[] => {
  return [
    ...new Set(
      points.map(com => com.request?.bindParams?.objectID).filter(Boolean) // 过滤 null/undefined/空字符串
    )
  ]
}
</script>

<style lang="scss" scoped>
@include go('preview') {
  position: relative;
  height: 100vh;
  width: 100vw;
  @include background-image('background-image');
  &.fit,
  &.full {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    .go-preview-scale {
      transform-origin: center center;
    }
  }
  &.scrollY {
    overflow-x: hidden;
    .go-preview-scale {
      transform-origin: left top;
    }
  }
  &.scrollX {
    overflow-y: hidden;
    .go-preview-scale {
      transform-origin: left top;
    }
  }
  .go-preview-entity {
    overflow: hidden;
  }
}
</style>
