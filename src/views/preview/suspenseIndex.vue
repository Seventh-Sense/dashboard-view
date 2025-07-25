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
    <FloatingIcon @click="handleFloatingIconClick" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { PreviewRenderList } from './components/PreviewRenderList'
import { getFilterStyle, setTitle } from '@/utils'
import {
  getEditCanvasConfigStyle,
  getSessionStorageInfo,
  clearStorage,
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
import { useRouter } from 'vue-router'
import { IntervalTimeOut, getAllDataIdsSafe, writeValue } from '../display/util/util'
import { FloatingIcon } from '../display/FloatingIcon'
import { PageEnum } from '@/enums/pageEnum'

const t = window['$t']
const router = useRouter()

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

onMounted(() => {
  //console.log('chartEditStore', chartEditStore.editCanvasConfig)
  readPointValue(chartEditStore.componentList)
})

onUnmounted(() => {
  clearStorage()
  if (interval) {
    window.clearInterval(interval)
  }
})

const handleFloatingIconClick = () => {
  router.replace({
    path: PageEnum.BASE_HOME_ITEMS
  })
}

const readPointValue = (dataList: any[]) => {
  let load = getAllDataIdsSafe(dataList)
  interval = window.setInterval(() => {
    readPointsDataById(load)
      .then((res: any) => {
        if (res.status === 'OK') {
          chartEditStore.componentList = writeValue(chartEditStore.componentList, res.data)
        } else {
          console.log('no data!')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, IntervalTimeOut)
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
