<template>
  <div style="height: 100vh;">
    <GraphicRender
      ref="graphicRenderItem"
      v-if="graphicData != null"
      :manager="dataHandleManager"
      :graphicData="parsedGraphics"
      @graphicLoaded="graphicLoaded"
      @itemClick="itemclick"
    ></GraphicRender>
    <FloatingIcon @click="handleFloatingIconClick" />
    <SetValueModal v-model:isShowModal="isShowModal" :data="clickParam"/>
  </div>
</template>

<script setup lang="ts">
import { readProject } from '@/api/http'
import { JSONParse } from '@/utils'
import { GraphicRender } from '@x-plateform/graphic-editor'
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PageEnum } from '@/enums/pageEnum'
import { FloatingIcon } from '@/views/display/FloatingIcon'
import DataHandleManager from './DataHandleManager'
import { SetValueModal } from './SetValueModal'

const graphicData = ref<any | null>(null)
const graphicRenderItem = ref<InstanceType<typeof GraphicRender> | null>(null);

const dataHandleManager = new DataHandleManager()

const routerParamsInfo = useRoute()
const router = useRouter()

const isShowModal = ref(false)
const clickParam = ref({})
//提示保存成功
const { id } = routerParamsInfo.params
// id 标识
const previewId = typeof id === 'string' ? id : id[0]

onMounted(() => {
  // Simulate fetching graphic data
  readProject(previewId)
    .then((res: any) => {
      if (res.status === 'OK' && res.data && res.data.content !== '') {
        graphicData.value = JSONParse(res.data.content)
      }
    })
    .catch(err => {
      console.log(err)
      graphicData.value = JSONParse('{}')
    })
})

const parsedGraphics = computed(() => {
  let ret = {}
  try {
    if (graphicData.value) {
      ret = JSON.parse(graphicData.value.data || '{}')
    }
  } catch (e) {
    console.error(e)
  }
  return ret
})

//控制图层的显示
const graphicLoaded = () => {
  //graphicRenderItem.value?.zoomFit()
}

const itemclick = (params: any) => {
  console.log('itemclick', params)
  //clickParam.value = params
  //isShowModal.value = true
}


const handleFloatingIconClick = () => {
  dataHandleManager.dispose()
  router.replace({
    path: PageEnum.BASE_HOME_ITEMS
  })
}
</script>

<style lang="scss" scoped></style>
