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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { PreviewRenderList } from './components/PreviewRenderList'
import { getFilterStyle, setTitle } from '@/utils'
import {
  getEditCanvasConfigStyle,
  getLocalStorageInfo,
  getSessionStorageInfo,
  keyRecordHandle,
  dragCanvas
} from './utils'
import { useComInstall } from './hooks/useComInstall.hook'
import { useScale } from './hooks/useScale.hook'
import { useStore } from './hooks/useStore.hook'
import { PreviewScaleEnum } from '@/enums/styleEnum'
import type { ChartEditStorageType } from './index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { setOption } from '@/packages/public'
import { readDeivceData } from '@/api/http'

// const localStorageInfo: ChartEditStorageType = getSessionStorageInfo() as ChartEditStorageType
//await getSessionStorageInfo()
await getLocalStorageInfo()
const chartEditStore = useChartEditStore() as unknown as ChartEditStorageType

setTitle(`预览-${chartEditStore.editCanvasConfig.projectName}`)

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

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const writeValue = (data: any) => {
  chartEditStore.componentList.map((com: any) => {
    //console.log("com", com)
    let bindInfo = com.request.bindParams;

    data.length > 0 && data.map((value: any) => {
      if (value.device === bindInfo.deviceID && value.attr === bindInfo.objectID) {
        com.option.dataset = value.value
        
      }
    })
  })
}

onMounted(() => {
  //console.log(chartEditStore.componentList)
  interval = window.setInterval(() => {
    //writeValue2();
    readDeivceData()
      .then(data => {
        if (data !== undefined) {
          writeValue(data)
        } else {
          console.log('no data!')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, 3000)
})

onUnmounted(() => {
  if (interval) {
    window.clearInterval(interval)
  }
})

const writeValue2 = () => {
  chartEditStore.componentList.map((com: any) => {
    
    if (com.key === "GaugeCommon") {
      com.option.dataset = getRandomNumber(com.option.minValue, com.option.maxValue)
    }
    
    if (com.key === "DigitFrame") { 
      com.option.dataset = getRandomNumber(0, 10)
    }

    
  })
}

const dataHandle = (type: string, value: any) => {

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
