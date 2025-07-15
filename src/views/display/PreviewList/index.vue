<template>
  <div :class="`go-preview ${chartData.editCanvasConfig.previewScaleType}`" @mousedown="dragCanvas">
    <template v-if="showEntity">
      <!-- 实体区域 -->
      <div ref="entityRef" class="go-preview-entity">
        <!-- 缩放层 -->
        <div ref="previewRef" class="go-preview-scale">
          <!-- 展示层 -->
          <div :style="previewRefStyle" v-if="show">
            <!-- 渲染层 -->
            <PreviewListRender :chartData="chartData" />
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
          <PreviewListRender :chartData="chartData" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { ChartEditStorageType } from '@/views/preview'
import { getEditCanvasConfigStyle, dragCanvas, keyRecordHandle } from '@/views/preview/utils'
import { getFilterStyle, JSONParse, setTitle } from '@/utils'
import { PreviewScaleEnum } from '@/enums/styleEnum'
import { useStore } from '@/views/preview/hooks/useStore.hook'
import { useScale } from '@/views/preview/hooks/useScale.hook'
import { useComInstall } from '@/views/preview/hooks/useComInstall.hook'
import { requestInterval, previewScaleType, requestIntervalUnit } from '@/settings/designSetting'
import { defaultTheme, globalThemeJson } from '@/settings/chartThemes/index'
import { PreviewListRender } from './PreviewListRender'

import { readPointsDataById } from '@/api/http'
import { IntervalTimeOut, getAllDataIdsSafe, writeValue } from '../util/util'

const props = defineProps({
  ProjectData: {
    type: Object,
    required: true
  },
  ProjectNum: {
    type: Number,
    required: true
  }
})

const chartData: ChartEditStorageType = reactive({
  id: 'useChartEditStore',
  editCanvas: {
    // 编辑区域 Dom
    editLayoutDom: null,
    editContentDom: null,
    // 偏移量
    offset: 20,
    // 系统控制缩放
    scale: 1,
    // 用户控制的缩放
    userScale: 1,
    // 锁定缩放
    lockScale: false,
    // 初始化
    isCreate: false,
    // 拖拽中
    isDrag: false,
    // 框选中
    isSelect: false,
    // 代码编辑中
    isCodeEdit: false
  },
  rightMenuShow: false,
  // 鼠标定位
  mousePosition: {
    startX: 0,
    startY: 0,
    x: 0,
    y: 0
  },

  targetChart: {
    hoverId: undefined,
    selectId: []
  },

  recordChart: undefined,

  editCanvasConfig: {
    // 项目名称
    projectName: undefined,
    // 默认宽度
    width: 1920,
    // 默认高度
    height: 1080,
    // 启用滤镜
    filterShow: false,
    // 色相
    hueRotate: 0,
    // 饱和度
    saturate: 1,
    // 对比度
    contrast: 1,
    // 亮度
    brightness: 1,
    // 透明度
    opacity: 1,
    // 变换（暂不更改）
    rotateZ: 0,
    rotateX: 0,
    rotateY: 0,
    skewX: 0,
    skewY: 0,
    // 混合模式
    blendMode: 'normal',
    // 默认背景色
    background: undefined,
    backgroundImage: undefined,
    // 是否使用纯颜色
    selectColor: true,
    // chart 主题色
    chartThemeColor: defaultTheme || 'dark',
    // 自定义颜色列表
    chartCustomThemeColorInfo: undefined,
    // 全局配置
    chartThemeSetting: globalThemeJson,
    // 适配方式
    previewScaleType: previewScaleType
  },

  requestGlobalConfig: {
    requestDataPond: [],
    requestOriginUrl: '',
    requestInterval: requestInterval,
    requestIntervalUnit: requestIntervalUnit,
    requestParams: {
      Body: {
        'form-data': {},
        'x-www-form-urlencoded': {},
        json: '',
        xml: ''
      },
      Header: {},
      Params: {}
    }
  },

  componentList: []
})
let interval: number | null = null
onMounted(async () => {
  await getPreviewInfoByInfo(props.ProjectData.content)

  console.log(props.ProjectNum, chartData.editCanvasConfig)
  readPointValue(chartData.componentList)
})

const previewRefStyle = computed(() => {
  return {
    overflow: 'hidden',
    ...getEditCanvasConfigStyle(chartData.editCanvasConfig),
    ...getFilterStyle(chartData.editCanvasConfig)
  }
})

const showEntity = computed(() => {
  const type = chartData.editCanvasConfig.previewScaleType
  return type === PreviewScaleEnum.SCROLL_Y || type === PreviewScaleEnum.SCROLL_X
})

useStore(chartData)
const { entityRef, previewRef } = useScale(chartData)
//加载显示的组件
const { show } = useComInstall(chartData)

// 开启键盘监听
keyRecordHandle()

const getPreviewInfoByInfo = (load: string) => {
  //console.log('load', load)
  if (load === '') {
    return
  }

  let data = JSONParse(load)
  chartData.editCanvasConfig = data.editCanvasConfig
  chartData.requestGlobalConfig = data.requestGlobalConfig
  chartData.componentList = data.componentList
}

const readPointValue = (dataList: any[]) => {
  let load = getAllDataIdsSafe(dataList)
  interval = window.setInterval(() => {
    readPointsDataById(load)
      .then((res: any) => {
        if (res.status === 'OK') {
          chartData.componentList = writeValue(chartData.componentList, res.data)
        } else {
          console.log('no data!')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, IntervalTimeOut)
}

onUnmounted(() => {
  if (interval) {
    window.clearInterval(interval)
  }
})
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
