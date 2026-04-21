<template>
  <!-- 工作台相关 -->
  <div class="go-chart">
    <n-layout>
      <layout-header-pro>
        <template #left>
          <header-left-btn></header-left-btn>
        </template>
        <template #center>
          <header-title></header-title>
        </template>
        <template #ri-left>
          <header-right-btn></header-right-btn>
        </template>
      </layout-header-pro>
      <n-layout-content content-style="overflow:hidden; display: flex">
        <div style="overflow: hidden; display: flex">
          <content-charts></content-charts>
          <content-layers></content-layers>
        </div>
        <content-configurations></content-configurations>
      </n-layout-content>
    </n-layout>
  </div>
  <!-- 右键 -->
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    size="small"
    :x="mousePosition.x"
    :y="mousePosition.y"
    :options="menuOptions"
    :show="chartEditStore.getRightMenuShow"
    :on-clickoutside="onClickOutSide"
    @select="handleMenuSelect"
  ></n-dropdown>
  <!-- 加载蒙层 -->
  <content-load></content-load>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { getLocalStorage, JSONParse, loadAsyncComponent, setLocalStorage } from '@/utils'
import { LayoutHeaderPro } from '@/layout/components/LayoutHeaderPro'
import { useContextMenu } from './hooks/useContextMenu.hook'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useChartHistoryStore } from '@/store/modules/chartHistoryStore/chartHistoryStore'
import { useSync } from '@/views/chart/hooks/useSync.hook'
import { ChartEditStorage } from '@/store/modules/chartEditStore/chartEditStore.d'
import { RequestBodyEnum, RequestHttpEnum, RequestHttpIntervalEnum } from '@/enums/httpEnum'
import { ChartFrameEnum } from '@/packages/index.d'
import { LangEnum, PreviewScaleEnum } from '@/enums/styleEnum'
import { StorageEnum } from '@/enums/storageEnum'
import { useRoute } from 'vue-router'
import { downloadFile, readProject } from '@/api/http'
import { useLangStore } from '@/store/modules/langStore/langStore'
import { base64DecodeUtf8 } from '../preview/utils'

const chartHistoryStoreStore = useChartHistoryStore()
const chartEditStore = useChartEditStore()
const { updateComponent } = useSync()
const routerParamsInfo = useRoute()
const langStore = useLangStore()

// 记录初始化
chartHistoryStoreStore.canvasInit(chartEditStore.getEditCanvas)

const HeaderLeftBtn = loadAsyncComponent(() => import('./ContentHeader/headerLeftBtn/index.vue'))
const HeaderRightBtn = loadAsyncComponent(() => import('./ContentHeader/headerRightBtn/index.vue'))
const HeaderTitle = loadAsyncComponent(() => import('./ContentHeader/headerTitle/index.vue'))
const ContentLayers = loadAsyncComponent(() => import('./ContentLayers/index.vue'))
const ContentCharts = loadAsyncComponent(() => import('./ContentCharts/index.vue'))
const ContentConfigurations = loadAsyncComponent(() => import('./ContentConfigurations/index.vue'))
const ContentLoad = loadAsyncComponent(() => import('./ContentLoad/index.vue'))

// 右键
const { menuOptions, onClickOutSide, mousePosition, handleMenuSelect } = useContextMenu()

onMounted(() => {
  const { id } = routerParamsInfo.params
  const previewId = typeof id === 'string' ? id : id[0]

  const ip = typeof id === 'string' ? '' : id[1] || ''
  const lang = typeof id === 'string' ? '' : id[2] || ''

  //设置lang
  setLanguage(lang)

  initData(ip)

  // initChart(previewId)
})

const filename = 'objConfig/dashboard.json'

const initData = (ip: string) => {
  downloadFile(ip, filename)
    .then((result: any) => {
      const hasValidData =
        result && result.data && typeof result.data === 'string' && Number(result.file_size) > 0

      if (hasValidData) {
        let data = JSONParse(base64DecodeUtf8(result.data))

        console.log('initData', data.content)

        nextTick(() => {
          updateComponent(data.content, true, true)
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
}

const initChart = (previewId: any) => {
  readProject(previewId)
    .then((res: any) => {
      if (res.status === 'OK' && res.data) {
        if (res.data.content !== '{}') {
          nextTick(() => {
            updateComponent(JSONParse(res.data.content), true, true)
          })
        }

        //保存title setLocalStorage('ProjectInfo', list.value)
        setLocalStorage('currentTitle', res.data.name)
      }
    })
    .catch(err => {
      console.log(err)
    })
}

const setLanguage = (lang: any) => {
  console.log('lang', lang)
  if (lang === 'jp') {
    langStore.changeLang(LangEnum.JA)
  } else if (lang === 'en') {
    langStore.changeLang(LangEnum.EN)
  } else if (lang === 'zh-tw') {
    langStore.changeLang(LangEnum.ZH_TW)
  } else {
    langStore.changeLang(LangEnum.ZH)
  }
}

onUnmounted(() => {
  nextTick(() => {
    chartEditStore.setInitCanves()
  })
})
</script>

<style lang="scss" scoped>
@include go('chart') {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  @include background-image('background-image');
}
</style>
