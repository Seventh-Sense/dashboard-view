<template>
  <n-modal v-model:show="showRef" class="go-create-modal" :mask-closable="false">
    <n-card
      :bordered="true"
      role="dialog"
      aria-modal="true"
      size="small"
      :mask-closable="false"
      style="width: 600px; background: rgba(0, 0, 0, 1); border-radius: 18px"
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
const initTable: any = inject('initTable')

const t = window['$t']

const showRef = ref(false)
const project_name = ref<string>(props.cardData.title)

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
      }
    })
    .catch(err => {
      console.log(err)
    })
}

const onPositiveClick = async () => {
  if (project_name.value !== '') {
    data.value.editCanvasConfig.projectName = project_name.value
    try {
      const res: any = await updateProject(props.cardData.id, {
        name: project_name.value,
        content: JSON.stringify(data.value)
      })
      if (res.status !== 'OK') {
        console.warn('Non-OK response status:', res.status)
        return
      }
      initTable()
      //props.cardData.title = project_name.value
      //props.cardData.label = project_name.value
    } catch (e) {
      console.error('onChange:', e)
    } finally {
      project_name.value = ''
      emit('close', false)
    }
  }
}

const closeHandle = () => {
  project_name.value = ''
  emit('close', false)
}
</script>

<style lang="scss" scoped>
$cardWidth: 570px;

@include go('create-modal') {
  position: fixed;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);

  &-title {
    font-size: 20px;
    color: #{$--color-dark-font};
    font-style: normal;
    text-transform: none;
    font-weight: bold;
  }

  .card-box {
    width: $cardWidth;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0);
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
      font-size: 16px;
      font-weight: bold;
      color: $--color-dark-font;
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
