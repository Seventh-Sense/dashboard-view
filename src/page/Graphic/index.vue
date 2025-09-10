<template>
  <GraphicEditor
    class="graphic-editor"
    v-if="graphicData !== null"
    :graphicData="graphicData"
    @onExit="onExit()"
    @onSave="onSave"
    @showPreview="showPreview"
  ></GraphicEditor>
</template>

<script setup lang="ts">
import { GraphicEditor } from '@x-plateform/graphic-editor'
import { onMounted, ref } from 'vue'
import { goDialog, goHome, JSONParse, JSONStringify } from '@/utils'
import { useRoute } from 'vue-router'
import { readProject, updateProject } from '@/api/http'
import { getLocalStorage } from '@/utils'
import { StorageEnum } from '@/enums/storageEnum'
import { LangStateType } from '@/store/modules/langStore/langStore.d'

const graphicData = ref<any | null>(null)

const t = window['$t']
const routerParamsInfo = useRoute()

//提示保存成功
const { id } = routerParamsInfo.params
// id 标识
const previewId = typeof id === 'string' ? id : id[0]

onMounted(() => {
  setLang()

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

const setLang = () => {
  const langStorage: LangStateType = getLocalStorage(StorageEnum.GO_LANG_STORE)

  if (langStorage !== null) {
    if (langStorage.lang === 'EN') {
      window.graphicItemManager.switchLanguage('en-US')
    } else {
      window.graphicItemManager.switchLanguage('zh-CN')
    }
  } else {
    window.graphicItemManager.switchLanguage('zh-CN')
  }
}

const onExit = () => {
  goDialog({
    message: t('project.msg_ack_save'),
    isMaskClosable: true,
    onPositiveCallback: () => {
      goHome()
      //useRemoveKeyboard()
    }
  })
}

const onSave = (data: any, callback?: (success: boolean) => void) => {
  let load = {
    ...graphicData.value,
    data: data.data
  }

  updateProject(previewId, {
    name: load.name,
    content: JSONStringify(load),
    //画布缩图
    //cover: canvas.toDataURL()
    cover: ''
  })
    .then(res => {
      if (res) {
        window['$message'].success(t('message.save_success'))
        callback && callback(true)
      }
      //console.log(res)
    })
    .catch(err => {
      console.log(err)
      callback && callback(false)
    })
}

const showPreview = () => {}
</script>

<style lang="scss" scoped>
.graphic-editor,
.graphic-editor::before,
.graphic-editor::after {
  box-sizing: unset !important;
}
</style>
