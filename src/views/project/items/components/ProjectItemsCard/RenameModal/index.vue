<template>
  <n-modal v-model:show="showRef" class="go-create-modal" :mask-closable="false">
    <n-card
      :bordered="true"
      role="dialog"
      aria-modal="true"
      size="small"
      :mask-closable="false"
      class="modal"
    >
      <template #header>
        <n-space justify="space-between" align="center">
          <span class="go-create-modal-title">
            {{ $t('global.r_rename') }}
          </span>
          <n-icon size="32" :depth="1" @click="closeHandle" style="cursor: pointer">
            <CloseOutlineIcon />
          </n-icon>
        </n-space>
      </template>
      <div class="card-box-con">
        <div class="card-box-title">{{ $t('device.project_name') }}</div>
        <n-input v-model:value="project_name" type="text" />
      </div>
      <template #footer>
        <n-space justify="end">
          <n-button @click="onPositiveClick" style="width: 72px">{{ $t('global.r_ok') }}</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, watch, inject, onMounted } from 'vue'
import { icon } from '@/plugins'
import { readProject, updateProject } from '@/api/http'
import { JSONParse } from '@/utils'
import { useDataListInit } from '@/views/project/items/components/ProjectItemsList/hooks/useData.hook'

const { renameHandle } = useDataListInit()
const { CloseOutlineIcon } = icon.ionicons5

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  cardData: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['close'])

const t = window['$t']

const showRef = ref(false)
const project_name = ref<string>(props.cardData.title)

const project_type = ref<string>('dashboard')

const data = ref<any>(null)

watch(
  () => props.show,
  newValue => {
    showRef.value = newValue

    if (newValue) {
      readData()
    }
  }
)

const readData = () => {
  readProject(props.cardData.id)
    .then((res: any) => {
      if (res.status === 'OK' && res.data && res.data.content !== '') {
        data.value = JSONParse(res.data.content)
        project_type.value = res.data.description
      }
    })
    .catch(err => {
      console.log(err)
    })
}

const onPositiveClick = async () => {
  if (!project_name.value) return // 空项目名直接返回

  if (project_name.value.length > 12) {
    window['$message'].error(t('msg.msg_error_10'))
    return
  }

  const shouldSetName = data.value !== '' // 统一判断条件
  await setName(shouldSetName)
}

const setName = async (shouldUpdateContent: boolean) => {
  try {
    // 需要更新内容时才设置名称
    if (shouldUpdateContent) {
      if (project_type.value === 'graphic') {
        data.value.name = project_name.value
      } else {
        data.value.editCanvasConfig.projectName = project_name.value
      }
    }

    const updateData = {
      name: project_name.value,
      ...(shouldUpdateContent && { content: JSON.stringify(data.value) })
    }

    const res: any = await updateProject(props.cardData.id, updateData)

    if (res?.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      return
    }

    renameHandle(res?.data)
  } catch (e) {
    console.error('onChange:', e)
  } finally {
    project_name.value = ''
    emit('close', false)
  }
}

const closeHandle = () => {
  project_name.value = ''
  emit('close', false)
}
</script>

<style lang="scss" scoped>
$cardWidth: 570px;

.modal {
  @include fetch-bg-color('modal-content1-background');
  width: 600px;
  border-radius: 18px;
}

@include go('create-modal') {
  position: fixed;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);

  &-title {
    @include fetch-theme-custom('color', 'modal-font-color');
    font-size: 20px;
    font-style: normal;
    text-transform: none;
    font-weight: bold;
  }

  .card-box {
    @include fetch-theme-custom('border-color', 'modal-font-color');
    width: $cardWidth;
    cursor: pointer;
    border-style: solid;
    border-width: 1px;

    @extend .go-transition;
    &:hover {
      @include hover-border-color('hover-border-color');
    }
    &-content {
      padding: 0px 10px;
      width: 100%;
    }
    &-con {
      width: 100%;
    }
    &-title {
      @include fetch-theme-custom('color', 'modal-font-color');
      font-size: 16px;
      font-weight: bold;
      margin-top: 16px;
      margin-bottom: 12px;
    }
  }
}

::v-deep(.n-card-header) {
  padding: 12px !important;
}

::v-deep(.n-card__content) {
  padding: 0 12px 12px 12px !important;
}

::v-deep(.n-card__footer) {
  padding: 0 12px 12px 12px !important;
}
</style>
