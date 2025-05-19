<template>
  <div class="go-items-list">
    <div class="list-pagination">
      <project-layout-create :collapsed="true"></project-layout-create>
    </div>
    <n-grid :x-gap="20" :y-gap="20" cols="2 s:2 m:3 l:3 xl:5 xxl:5" responsive="screen">
      <n-grid-item v-for="(item, index) in list" :key="item.id">
        <project-items-card
          :cardData="item"
          @resize="resizeHandle"
          @delete="deleteHandle($event, index)"
          @edit="editHandle"
          @preview="previewHandle"
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
</template>

<script setup lang="ts">
import { ProjectItemsCard } from '../ProjectItemsCard/index'
import { ProjectItemsModalCard } from '../ProjectItemsModalCard/index'
import { icon } from '@/plugins'
import { useModalDataInit } from './hooks/useModal.hook'
import { useDataListInit } from './hooks/useData.hook'
import { ProjectLayoutCreate } from '../../../layout/components/ProjectLayoutCreate/index'
import { provide, onMounted, ref, watch } from 'vue'
import { readProjectList } from '@/api/http'
import { setLocalStorage } from '@/utils'

const { CopyIcon, EllipsisHorizontalCircleSharpIcon } = icon.ionicons5
const { list, deleteHandle, addProject, deleteAll } = useDataListInit()
const { modalData, modalShow, closeModal, resizeHandle, editHandle, previewHandle } =
  useModalDataInit()

onMounted(() => {
  initTable()
})

const initTable = async () => {
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
    align-items: center;
    height: 72px;
  }
}
</style>
