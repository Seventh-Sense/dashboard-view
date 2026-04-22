<template>
  <div>
    <suspense>
      <GraphicSingle :ProjectData="projectInfo" />
    </suspense>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { GraphicSingle } from './GraphicSingle'
import { useRoute, useRouter } from 'vue-router'
import localforage from '@/utils/localforage'
import { JSONParse } from '@/utils'
import { PageEnum } from '@/enums/pageEnum'
import { downloadFile } from '@/api/http'
import { base64DecodeUtf8 } from '@/views/preview/utils'

const router = useRouter()
const routerParamsInfo = useRoute()

const { id } = routerParamsInfo.params

const projectInfo = ref<any>({})

onMounted(async () => {
  try {
    const ip = typeof id === 'string' ? '' : id[1] || ''

    const result: any = await downloadFile(ip, 'objConfig/graphic.json')
    const hasValidData =
      result && result.data && typeof result.data === 'string' && Number(result.file_size) > 0

    if (hasValidData) {
      const data = JSONParse(base64DecodeUtf8(result.data))

      projectInfo.value = data
    }
    // const list: any = await localforage.getItem('ProjectList')

    // if (!Array.isArray(list) || list.length === 0) {
    //   console.warn('No projects found in localforage.')
    //   return
    // }

    // const matchItem = list.find(element => element?.id === id[0])
    // if (!matchItem) {
    //   console.warn(`No project found with id: ${id}`)
    //   return
    // }

    //projectInfo.value = JSONParse(matchItem.content)
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
