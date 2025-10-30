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
    <FloatingIcon @click="handleFloatingIconClick()" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { PreviewRenderList } from './components/PreviewRenderList'
import { getFilterStyle, JSONParse, setTitle } from '@/utils'
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
import { setOption } from '@/packages/public'
import { readPoints } from '@/api/http'
import { FloatingIcon } from './components/FloatingIcon'
import { useRouter } from 'vue-router'
import { PageEnum } from '@/enums/pageEnum'

const props = defineProps({
  ProjectData: {
    type: Object,
    required: true
  },
})

//await getPreviewInfo()
const chartEditStore = useChartEditStore() as unknown as ChartEditStorageType

let interval: number | null = null

onMounted(async () => {
  await getPreviewInfoByInfo(props.ProjectData.content)

  interval = window.setInterval(() => {
    readPoints()
      .then(data => {
        if (data) {
          writeValue(data)
        } else {
          console.log('no data!')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, 1500)
})

const getPreviewInfoByInfo = (load: string) => {
  //console.log('load', load)
  if (load === '') {
    return
  }

  let data = JSONParse(load)
  chartEditStore.editCanvasConfig = data.editCanvasConfig
  chartEditStore.requestGlobalConfig = data.requestGlobalConfig
  chartEditStore.componentList = data.componentList


  setTitle(`预览-${data.editCanvasConfig.projectName}`)
}

const previewRefStyle = computed(() => {
  return {
    overflow: 'hidden',
    ...getEditCanvasConfigStyle(chartEditStore.editCanvasConfig),
    ...getFilterStyle(chartEditStore.editCanvasConfig)
  }
})



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
  chartEditStore.componentList.map((com: any) => {
    //console.log("com", com)
    let bindInfo = com.request.bindParams

    data.length > 0 &&
      data.map((value: any) => {
        if (
          value.modbus_id.toString() === bindInfo.deviceID &&
          value.id.toString() === bindInfo.objectID
        ) {
          //console.log("com", com, value, bindInfo)
          if (com.key === 'Online') {
            com.option.dataset = value.status
          } else {
            com.option.dataset = value.value
          }
        }
      })
  })
}

onUnmounted(() => {
  if (interval) {
    window.clearInterval(interval)
  }
})

const scale = computed(() => {
  const scaleX = window.innerWidth / chartEditStore.editCanvasConfig.width;
  const scaleY = window.innerHeight / chartEditStore.editCanvasConfig.height;
  // 取最小值保证内容完整显示，若需填满容器可改为 Math.max()
  return Math.min(scaleX, scaleY);
});

const router = useRouter()

const handleFloatingIconClick = () => {
  router.replace({
    path: PageEnum.BASE_HOME_ITEMS
  })
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
      transform: scale(v-bind('scale'), v-bind('scale')) !important;
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
