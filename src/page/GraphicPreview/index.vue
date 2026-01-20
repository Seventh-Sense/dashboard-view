<template>
  <div>
    <suspense>
      <GraphicSingle :ProjectData="projectInfo" />
    </suspense>
    <FloatingIcon @click="handleFloatingIconClick" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { GraphicSingle } from './GraphicSingle'
import { useRoute, useRouter } from 'vue-router'
import localforage from '@/utils/localforage'
import { JSONParse } from '@/utils'
import { FloatingIcon } from '@/views/display/FloatingIcon'
import { PageEnum } from '@/enums/pageEnum'

const router = useRouter()
const routerParamsInfo = useRoute()

const { id } = routerParamsInfo.params

const projectInfo = ref<any>({})

onMounted(async () => {
  try {
    const list: any = await localforage.getItem('ProjectList')

    if (!Array.isArray(list) || list.length === 0) {
      console.warn('No projects found in localforage.')
      return
    }

    const matchItem = list.find(element => element?.id === id[0])
    if (!matchItem) {
      console.warn(`No project found with id: ${id}`)
      return
    }

    projectInfo.value = JSONParse(matchItem.content)
  } catch (error) {
    console.error('Error during GraphicPreview onMounted:', error)
  }
})

const handleFloatingIconClick = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.replace({
      path: PageEnum.BASE_HOME_ITEMS
    })
  }
}
</script>

<style lang="scss" scoped></style>
