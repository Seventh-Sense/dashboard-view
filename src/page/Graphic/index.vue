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
import { downloadFile, readProject, setConfigFile, updateProject } from '@/api/http'
import { getLocalStorage } from '@/utils'
import { StorageEnum } from '@/enums/storageEnum'
import { LangStateType } from '@/store/modules/langStore/langStore.d'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { base64DecodeUtf8 } from '@/views/preview/utils'

const designStore = useDesignStore()
const graphicData = ref<any | null>(null)

const t = window['$t']
const routerParamsInfo = useRoute()

//提示保存成功
const { id } = routerParamsInfo.params
// id 标识
const previewId = typeof id === 'string' ? id : id[0]

const lang = typeof id === 'string' ? '' : id[1] || ''

onMounted(() => {
  setTheme()
  setLang()

  initData()
})

const initData = async () => {
  try {
    const ip = typeof id === 'string' ? '' : id[1] || ''

    const result: any = await downloadFile(ip, 'objConfig/graphic.json')

    const hasValidData =
      result && result.data && typeof result.data === 'string' && Number(result.file_size) > 0

    if (hasValidData) {
      const data = JSONParse(base64DecodeUtf8(result.data))
      console.log(data)
      //graphicData.value = JSONParse('{}')
      graphicData.value = data
    } else {
      graphicData.value = JSONParse('{}')
    }
  } catch (error) {
    console.error('Error during Graphic onMounted:', error)
    graphicData.value = JSONParse('{}')
  }
}

const setTheme = () => {
  const body = document.body
  if (designStore.darkTheme) {
    body.classList.remove('x-theme-2')
    body.classList.add('x-theme-1')
  } else {
    body.classList.remove('x-theme-1')
    body.classList.add('x-theme-2')
  }
}

const setLang = () => {
  // const langStorage: LangStateType = getLocalStorage(StorageEnum.GO_LANG_STORE)

  // if (langStorage !== null) {
  //   if (langStorage.lang === 'EN') {
  //     window.graphicItemManager.switchLanguage('en-US')
  //   } else {
  //     window.graphicItemManager.switchLanguage('zh-CN')
  //   }
  // } else {
  //   window.graphicItemManager.switchLanguage('zh-CN')
  // }

  if (lang === 'jp') {
    window.graphicItemManager.switchLanguage('zh-CN')
  } else if (lang === 'en') {
    window.graphicItemManager.switchLanguage('en-US')
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

  const ip = typeof id === 'string' ? '' : id[1] || ''

  //console.log(data, JSONParse(data.data))

  const file = new File(
    [
      JSON.stringify({
        useTemplate: false,
        templateRef: '',
        data: data.data,
        previewImage: '',
        options: '',
        reference: '',
        name: 'Graphic',
        description: null,
        type: 'graphic',
        digitalTags: [],
        lastUpdateTime: ''
      })
    ],
    'graphic.json',
    { type: 'application/json' }
  )

  setConfigFile(ip, file, 'objConfig/graphic.json')
    .then((res: any) => {
      window['$message'].success(t('message.save_success'))
      callback && callback(true)
    })
    .catch(err => {
      console.log(err)
      callback && callback(false)
    })

  // updateProject(previewId, {
  //   name: load.name,
  //   content: JSONStringify(load),
  //   //画布缩图
  //   //cover: canvas.toDataURL()
  //   cover: ''
  // })
  //   .then(res => {
  //     if (res) {
  //       window['$message'].success(t('message.save_success'))
  //       callback && callback(true)
  //     }
  //     //console.log(res)
  //   })
  //   .catch(err => {
  //     console.log(err)
  //     callback && callback(false)
  //   })
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
