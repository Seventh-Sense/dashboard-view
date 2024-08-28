<template>
  <n-space class="go-mt-0" :wrap="false">
    <n-button
      v-for="item in comBtnList"
      :key="item.title"
      :type="item.type"
      ghost
      @click="item.event"
    >
      <template #icon>
        <component :is="item.icon"></component>
      </template>
      <span>{{ item.title }}</span>
    </n-button>
  </n-space>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  renderIcon,
  goDialog,
  fetchPathByName,
  routerTurnByPath,
  setSessionStorage,
  getLocalStorage,
  setLocalStorage,
  JSONStringify
} from '@/utils'
import { PreviewEnum } from '@/enums/pageEnum'
import { StorageEnum } from '@/enums/storageEnum'
import { useRoute, useRouter } from 'vue-router'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { syncData } from '../../ContentEdit/components/EditTools/hooks/useSyncUpdate.hook'
import { icon } from '@/plugins'
import { cloneDeep } from 'lodash'
import { useDataListInit } from '@/views/project/items/components/ProjectItemsList/hooks/useData.hook'
import { updateProject } from '@/api/http'
import html2canvas from 'html2canvas'

const router = useRouter()
const { BrowsersOutlineIcon, SendIcon, AnalyticsIcon, LogOutOutlineIcon } = icon.ionicons5
const chartEditStore = useChartEditStore()

const routerParamsInfo = useRoute()
const { addHandle } = useDataListInit()
const t = window['$t']
// 预览
const previewHandle = () => {
  const path = fetchPathByName(PreviewEnum.CHART_PREVIEW_NAME, 'href')
  if (!path) return
  const { id } = routerParamsInfo.params
  // id 标识
  const previewId = typeof id === 'string' ? id : id[0]
  const storageInfo = chartEditStore.getStorageInfo()
  const sessionStorageInfo = getLocalStorage(StorageEnum.GO_CHART_STORAGE_LIST) || []

  if (sessionStorageInfo?.length) {
    const repeateIndex = sessionStorageInfo.findIndex((e: { id: string }) => e.id === previewId)
    // 重复替换
    if (repeateIndex !== -1) {
      sessionStorageInfo.splice(repeateIndex, 1, { id: previewId, ...storageInfo })
      setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, sessionStorageInfo)
    } else {
      sessionStorageInfo.push({
        id: previewId,
        ...storageInfo
      })
      setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, sessionStorageInfo)
    }
  } else {
    setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, [{ id: previewId, ...storageInfo }])
  }
  // 跳转
  routerTurnByPath(path, [previewId], undefined, true)
}

// 保存画布数据
const sendHandle = async () => {
  //获取画布数据
  const storageInfo = chartEditStore.getStorageInfo()

  //提示保存成功
  const { id } = routerParamsInfo.params
  // id 标识
  const previewId = typeof id === 'string' ? id : id[0]

  //存储在菜单中
  //addHandle({id: id, ...storageInfo})
  //存储在本地浏览器中
  //saveLocalStorage(previewId, storageInfo)

  //console.log(storageInfo)

  const range = document.querySelector('.go-edit-range') as HTMLElement
  html2canvas(range, {
    backgroundColor: null,
    allowTaint: true,
    useCORS: true,
    // svg: {
    //   // 处理SVG
    //   xmlns: true,
    //   renderer: (svg: any) => {
    //     // 将SVG转换为PNG
    //     return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg)))}`
    //   }
    // }
  }).then((canvas: HTMLCanvasElement) => {
    updateProject(previewId, {
      name: storageInfo.editCanvasConfig.projectName,
      content: JSONStringify(storageInfo),
      cover: canvas.toDataURL()
    })
      .then(res => {
        if (res) {
          window['$message'].success('保存成功')
        }
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  })
}

const saveLocalStorage = (id: any, storageInfo: any) => {
  let data = getLocalStorage(StorageEnum.GO_CHART_STORAGE_LIST) || []

  let flag = true
  data &&
    data.forEach((d: any) => {
      if (d.id === id) {
        flag = false
        d.componentList = storageInfo.componentList
        d.editCanvasConfig = storageInfo.editCanvasConfig
        d.requestGlobalConfig = storageInfo.requestGlobalConfig
      }
    })

  if (flag) {
    data.push({ id: id, ...storageInfo })
  }

  console.log(data)
  setLocalStorage(StorageEnum.GO_CHART_STORAGE_LIST, data)
}
;2
const exitHandle = () => {
  router.back()
}

const btnList = [
  {
    select: true,
    title: '同步内容',
    type: 'primary',
    icon: renderIcon(AnalyticsIcon),
    event: syncData
  },
  {
    select: true,
    title: t('dashboard.preview'),
    icon: renderIcon(BrowsersOutlineIcon),
    event: previewHandle
  },
  {
    select: true,
    title: t('dashboard.save'),
    icon: renderIcon(SendIcon),
    event: sendHandle
  },
  {
    select: true,
    title: '退出',
    icon: renderIcon(LogOutOutlineIcon),
    event: exitHandle
  }
]

const comBtnList = computed(() => {
  if (chartEditStore.getEditCanvas.isCodeEdit) {
    return btnList
  }
  const cloneList = cloneDeep(btnList)
  cloneList.shift()
  return cloneList
})
</script>

<style lang="scss" scoped>
.align-center {
  margin-top: -4px;
}
</style>
