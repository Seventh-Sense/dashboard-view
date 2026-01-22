<template>
  <div class="go-items-list">
    <div class="list-pagination">
      <div class="list-preview" @click="onPreview">{{ $t('dashboard.preview') }}</div>
      <!-- <div v-if="!isShow" class="list-preview" @click="onPreview">{{ $t('dashboard.preview') }}</div> -->
      <project-layout-create v-if="isShow" :collapsed="true"></project-layout-create>
      <n-dropdown
        v-if="isShow"
        trigger="hover"
        :options="options"
        placement="bottom-end"
        @select="handleSelect"
      >
        <n-icon size="24" :depth="1" style="cursor: pointer">
          <ListIcon />
        </n-icon>
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
import { deleteProject, importProjects, readProjectList } from '@/api/http'
import {
  setLocalStorage,
  getLoginUser,
  routerTurnByName,
  downloadTextFile,
  JSONStringify
} from '@/utils'
import { PageEnum } from '@/enums/pageEnum'
import { DropdownOption } from 'naive-ui'
import localforage from '@/utils/localforage'
import { icon } from '@/plugins'
import { renderIcon } from '@/utils'

const { ListIcon, RefreshIcon } = icon.ionicons5
const { DocumentExportIcon, DocumentImportIcon, DeleteIcon } = icon.carbon

const { list, deleteHandle, addProject, deleteAll, renameHandle } = useDataListInit()
const { modalData, modalShow, closeModal, resizeHandle, editHandle, previewHandle } =
  useModalDataInit()

const flag = ref(false)
const isShow = ref(false)

const t = window['$t']

const fileInput = ref<HTMLInputElement | null>(null)

//menu  renderImage(SVG_ICON.card_icons.restart, '', 24, 24)
const options: any[] = [
  {
    label: () => t('device.import_devices'),
    key: '1',
    icon: renderIcon(DocumentImportIcon)
  },
  {
    label: () => t('device.export_devices'),
    key: '2',
    icon: renderIcon(DocumentExportIcon)
  },
  {
    label: () => t('device.refresh'),
    key: '3',
    icon: renderIcon(RefreshIcon)
  },
  {
    label: () => t('device.delete_all'),
    key: '4',
    icon: renderIcon(DeleteIcon)
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

    //存储projectList
    await localforage.setItem('ProjectList', res.data)

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
      id: item.id,
      type: item.description
    })
  })

  setLocalStorage('ProjectInfo', array)
}

const onPreview = async () => {
  const list: any = await localforage.getItem('ProjectList')

  if (list.length > 0) {
    routerTurnByName(PageEnum.BASE_VANT_NAME, true)
  }
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
    case '4':
      clearAll()
      break
    default:
      console.warn('Unknown menu option selected:', key)
  }
}

const clearAll = async () => {
  if (list.value.length === 0) return

  console.log('clearAll called', list.value)

  try {
    const validPromiseList = list.value
      .filter(item => item?.id)
      .map(async item => {
        try {
          const res: any = await deleteProject(item.id)
          // 双重校验：接口返回存在 + 状态为OK
          if (!res || res.status !== 'OK') {
            console.warn(`删除项目失败[id:${item.id}]，状态:`, res?.status)
            // 抛出错误，会被外层catch捕获，但不影响其他请求
            throw new Error(`项目${item.id}删除失败`)
          }
        } catch (error) {
          console.error(`删除项目异常[id:${item.id}]`, error)
          return Promise.resolve(false)
        }
      })

    await Promise.all(validPromiseList)

    list.value = []

    //同步缓存
    await localforage.setItem('ProjectList', [])
  } catch (error) {
    console.error('Error deleting project:', error)
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
  @include fetch-bg-color('card-background');
  @include fetch-theme('box-shadow');
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: calc(100vh - #{$--header-height} - 32px);
  border-radius: 18px;
  padding: 0 16px;

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
    @include fetch-theme-custom('border-color', 'button1-border-color');
    height: 34px;
    width: 78px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-style: solid;
    border-width: 1px;
    border-radius: 4px;
    cursor: pointer;
  }
}
</style>
