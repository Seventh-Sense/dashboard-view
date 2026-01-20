<template>
  <div style="height: 100vh">
    <GraphicRender
      ref="graphicRenderItem"
      v-if="graphicData != null"
      :manager="dataHandleManager"
      :graphicData="parsedGraphics"
      @graphicLoaded="graphicLoaded"
      @itemClick="itemclick"
    ></GraphicRender>
    <SetValueModal v-model:isShowModal="isShowModal" :data="clickParam" />
  </div>
</template>

<script setup lang="ts">
import { GraphicRender } from '@x-plateform/graphic-editor'
import { ref, computed, watch, onUnmounted } from 'vue'
import DataHandleManager from '../DataHandleManager'
import { SetValueModal } from '../SetValueModal'

const props = defineProps({
  ProjectData: {
    type: Object,
    required: true
  }
})

const graphicData = ref<any | null>(null)
const graphicRenderItem = ref<InstanceType<typeof GraphicRender> | null>(null)

const dataHandleManager = new DataHandleManager()

const isShowModal = ref(false)
const clickParam = ref({})

onUnmounted(() => {
  dataHandleManager.dispose()
})

watch(
  () => props.ProjectData,
  newVal => {
    graphicData.value = newVal
    //console.log('graphicData', graphicData.value)
  },
  { deep: true, immediate: true }
)

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
  if (params.action === 'setValue') {
    console.log('itemclick', params)
    clickParam.value = params
    isShowModal.value = true
  }
}
</script>

<style lang="scss" scoped></style>
