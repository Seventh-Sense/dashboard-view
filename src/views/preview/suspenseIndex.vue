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
  clearStorage,
  keyRecordHandle,
  dragCanvas,
  getPreviewInfo,
  getFileInfo
} from './utils'
import { useComInstall } from './hooks/useComInstall.hook'
import { useScale } from './hooks/useScale.hook'
import { useStore } from './hooks/useStore.hook'
import { PreviewScaleEnum } from '@/enums/styleEnum'
import type { ChartEditStorageType } from './index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { readPointsDataById, readPValue } from '@/api/http'
import { useRouter } from 'vue-router'
import { IntervalTimeOut, getAllDataIdsSafe, writeValue } from '../display/util/util'
import { useRoute } from 'vue-router'

const t = window['$t']
const router = useRouter()
const routerParamsInfo = useRoute()

//await getSessionStorageInfo()
await getFileInfo(routerParamsInfo)
const chartEditStore = useChartEditStore() as unknown as ChartEditStorageType

setTitle(`${t('global.r_preview')}-Graphic`)

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

onMounted(async () => {
  // try {
  //   //获取各种类型额外属性
  //   const params = await getBindParams(chartEditStore.componentList)
  //   if (params) {
  //     chartEditStore.componentList = params
  //   }

  //   readValues(chartEditStore.componentList)
  // } catch (error) {
  //   console.error('Error during onMounted:', error)
  // }

  let binds = getParamInfo(chartEditStore.componentList)

  getValues(binds)
  //console.log(binds)
})

onUnmounted(() => {
  clearStorage()
  if (interval) {
    window.clearInterval(interval)
    interval = null
  }
})

const getParamInfo = (dataList: any[]) => {
  const bindPoints: any[] = []
  const uniqueKeys = new Set<string>()

  for (const data of dataList) {
    const { deviceID, objectID, deviceType, dataType } = data.request.bindParams
    if (deviceID === '' || objectID === '') continue

    const uniqueKey = `${deviceID}|${objectID}`

    if (!uniqueKeys.has(uniqueKey)) {
      uniqueKeys.add(uniqueKey)
      bindPoints.push({
        device_id: deviceID,
        object_id: objectID,
        device_type: deviceType,
        data_type: dataType
      })
    } else {
      //console.log(`跳过重复绑定点: device_id=${deviceID}, object_id=${objectID}`)
    }
  }

  return bindPoints
}

const getValues = (points: any[]) => {
  if (interval) {
    window.clearInterval(interval)
    interval = null
  }

  getPointValue(points)

  interval = window.setInterval(() => {
    getPointValue(points)
  }, 3000)
}

// 异步函数，支持 await
const getPointValue = async (load: any[]) => {
  // 空数组直接返回
  if (!load.length) return

  try {
    const { id } = routerParamsInfo.params
    // 简化 ip 赋值逻辑
    const ip = typeof id === 'string' ? '' : id[1] || ''

    // 遍历执行异步请求（这里用 for...of 替代 forEach，支持 await）
    for (const item of load) {
      try {
        // 等待接口返回结果
        const result: any = await readPValue({
          device_address: ip,
          device_type: item.device_type,
          device_uid: item.device_id,
          points: [
            {
              point_uid: item.object_id,
              data_type: item.data_type,
              priority: 16
            }
          ]
        })

        //console.log(result)

        // 校验结果合法性
        const isValidRead =
          result.success && result.points?.length && result.points[0]?.present_value !== undefined

        if (!isValidRead) {
          continue
        }

        writePValue(result.points[0], item)
      } catch (itemErr) {
        // 单个请求失败，不影响其他请求执行
        console.warn('单条点位读取失败：', item.object_id)
      }
    }
  } catch (err) {
    // 外层捕获：参数异常、循环外的逻辑错误
    console.error('getPointValue 执行异常：', err)
  }
}

const writePValue = (data: any, point: any) => {
  chartEditStore.componentList.map((component: any) => {
    const { deviceID, objectID } = component.request.bindParams

    if (objectID === point.object_id) {
      if (component.key === 'Online') {
        component.option.timestamp = Date.now()
        component.option.dataset = data.status
      } else if (component.key === 'Image') {
        component.option.timestamp = Date.now()
        component.option.datavalue = data.present_value
      } else {
        component.option.timestamp = Date.now()
        component.option.dataset =  data.present_value
      }
    }
  })
}

const readValues = (dataList: any[]) => {
  const safeDataList = Array.isArray(dataList) ? dataList : []
  let load: any = getAllDataIdsSafe(safeDataList)

  if (interval) {
    window.clearInterval(interval)
    interval = null
  }

  readPointValue(load)

  interval = window.setInterval(() => {
    readPointValue(load)
  }, IntervalTimeOut())
}

const readPointValue = (load: any) => {
  if (load.length > 0) {
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
  }
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
