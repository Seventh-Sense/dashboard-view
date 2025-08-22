<template>
  <div class="go-items-list">
    <div class="list-pagination">
      <div class="list-preview" @click="onPreview">{{ $t('dashboard.preview') }}</div>
      <project-layout-create v-if="isShow" :collapsed="true"></project-layout-create>
      <n-dropdown trigger="hover" :options="options" placement="bottom-end" @select="handleSelect">
        <img width="24" height="24" :src="SVG_ICON.card_icons.list" style="cursor: pointer" />
      </n-dropdown>
    </div>
    <div
      v-if="flag"
      style="display: flex; align-items: center; justify-content: center; height: 80vh"
    >
      <n-spin size="small" />
    </div>

    <n-grid v-else :x-gap="20" :y-gap="20" cols="2 s:2 m:3 l:3 xl:5 xxl:5" responsive="screen">
      <n-grid-item v-for="(item, index) in list" :key="item.id">
        <project-items-card
          :cardData="item"
          @resize="resizeHandle"
          @delete="deleteHandle($event, index)"
          @edit="editHandle"
          @preview="previewHandle"
          @rename="renameHandle"
        ></project-items-card>
      </n-grid-item>
    </n-grid>
  </div>
  <project-items-modal-card
    v-if="modalData"
    :modalShow="modalShow"
    :cardData="modalData"
    @close="closeModal"
    @edit="editHandle"
  ></project-items-modal-card>
  <!-- 隐藏的文件输入 -->
  <input
    ref="fileInput"
    type="file"
    accept=".json"
    style="display: none"
    @change="handleFileUpload"
  />
</template>

<script setup lang="ts">
import { ProjectItemsCard } from '../ProjectItemsCard/index'
import { ProjectItemsModalCard } from '../ProjectItemsModalCard/index'
import { useModalDataInit } from './hooks/useModal.hook'
import { useDataListInit } from './hooks/useData.hook'
import { ProjectLayoutCreate } from '../../../layout/components/ProjectLayoutCreate/index'
import { provide, onMounted, ref, watch } from 'vue'
import { importProjects, readProjectList } from '@/api/http'
import {
  setLocalStorage,
  getLoginUser,
  routerTurnByName,
  renderImage,
  downloadTextFile,
  JSONStringify,
  JSONParse
} from '@/utils'
import { PageEnum } from '@/enums/pageEnum'
import SVG_ICON from '@/svg/SVG_ICON'
import { DropdownOption } from 'naive-ui'

const { list, deleteHandle, addProject, deleteAll, renameHandle } = useDataListInit()
const { modalData, modalShow, closeModal, resizeHandle, editHandle, previewHandle } =
  useModalDataInit()

const flag = ref(false)
const isShow = ref(false)

const t = window['$t']

const fileInput = ref<HTMLInputElement | null>(null)

//menu
const options: any[] = [
  {
    label: () => t('device.import_devices'),
    key: '1',
    icon: renderImage(SVG_ICON.card_icons.import_, '', 24, 24)
  },
  {
    label: () => t('device.export_devices'),
    key: '2',
    icon: renderImage(SVG_ICON.card_icons.export_, '', 24, 24)
  },
  {
    label: () => t('device.refresh'),
    key: '3',
    icon: renderImage(SVG_ICON.card_icons.restart, '', 24, 24)
  }
]

onMounted(() => {
  isShow.value = getLoginUser()

  initTable()
})

const initTable = async () => {
  flag.value = true

  try {
    deleteAll()

    const res: any = await readProjectList()

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      return
    }

    res.data.forEach((item: any) => {
      addProject(item)
    })
    storageInfo(res.data)
  } catch (e) {
    console.error('onChange:', e)
  } finally {
    flag.value = false
  }
}

//保存项目信息
const storageInfo = (res: any[]) => {
  let array: any[] = []

  res.forEach(item => {
    array.push({
      name: item.name,
      id: item.id
    })
  })

  setLocalStorage('ProjectInfo', array)
}

const onPreview = () => {
  //routerTurnByName(PageEnum.BASE_DISPLAY_NAME, true)

  routerTurnByName(PageEnum.BASE_VANT_NAME, true)
}

const handleSelect = (key: string | number, option: DropdownOption, event: MouseEvent) => {
  switch (key) {
    case '1':
      fileInput.value?.click()
      break
    case '2':
      exportAllProject()
      break
    case '3':
      initTable()
      break
    default:
      console.warn('Unknown menu option selected:', key)
  }
}

const exportAllProject = async () => {
  try {
    const res: any = await readProjectList()

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      return
    }

    //json文件
    downloadTextFile(JSONStringify(res.data), undefined, 'json')
  } catch (error) {
    console.error('Error exporting all projects:', error)
  }
}

// 处理文件上传
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement

  const file = input.files?.[0]

  if (!file) return

  try {
    const fileBuffer = await readFileAsArrayBuffer(file)
    const jsonData = await parseArrayBufferToJson(fileBuffer)

    const res: any = await importProjects(jsonData)

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      return
    }

    initTable()
  } catch (error) {
    console.error('Failed to get files:', error)
  } finally {
    // 重置输入以允许重复选择相同文件
    input.value = ''
  }
}

const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target?.result as ArrayBuffer)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

const parseArrayBufferToJson = (arrayBuffer: ArrayBuffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      // 将ArrayBuffer转换为字符串
      const decoder = new TextDecoder('utf-8')
      const jsonString = decoder.decode(arrayBuffer)
      
      // 将字符串解析为JSON对象
      const jsonData = JSON.parse(jsonString)
      resolve(jsonData)
    } catch (error) {
      reject(new Error('Failed to parse file as JSON: ' + error))
    }
  })
}

provide('initTable', initTable)
</script>

<style lang="scss" scoped>
$contentHeight: 250px;
@include go('items-list') {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: calc(100vh - #{$--header-height} - 32px);
  border-radius: 18px;
  padding: 0 16px;
  background-color: #{$--color-dark-side};
  .list-content {
    position: relative;
    height: $contentHeight;
  }
  .list-pagination {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    align-items: center;
    height: 72px;
  }

  .list-preview {
    height: 34px;
    width: 78px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px #ffffff12 solid;
    border-radius: 4px;
    cursor: pointer;
  }
}
</style>
