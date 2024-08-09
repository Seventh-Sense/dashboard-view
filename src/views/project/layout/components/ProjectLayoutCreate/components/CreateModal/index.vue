<template>
  <n-modal
    v-model:show="showRef"
    class="go-create-modal"
    :mask-closable="false"
    @afterLeave="closeHandle"
  >
    <n-space size="large">
      <n-card class="card-box" hoverable>
        <template #header>
          <n-text class="card-box-tite">{{ $t('project.create_tip') }}</n-text>
        </template>
        <template #header-extra>
          <n-text @click="closeHandle">
            <n-icon size="20">
              <component :is="CloseIcon"></component>
            </n-icon>
          </n-text>
        </template>
        <div class="card-box-con">
          <div class="card-box-title">{{ $t('device.project_name') }}:</div>
          <n-input v-model:value="project_name" type="text" />
        </div>
        <!-- <n-space class="card-box-content" justify="center">
          <n-button
            size="large"
            :disabled="item.disabled"
            v-for="item in typeList"
            :key="item.key"
            @click="btnHandle"
          >
            <component :is="item.title"></component>
            <template #icon>
              <n-icon size="18">
                <component :is="item.icon"></component>
              </n-icon>
            </template>
          </n-button>
        </n-space> -->
        <template #action></template>
        <template #footer>
          <n-space justify="end">
            <n-button @click="closeHandle">{{ $t('global.r_cancel') }}</n-button>
            <n-button type="info" @click="onPositiveClick">{{ $t('global.r_create') }}</n-button>
          </n-space>
        </template>
      </n-card>
    </n-space>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, watch, shallowRef, inject  } from 'vue'
import { icon } from '@/plugins'
import { PageEnum, ChartEnum } from '@/enums/pageEnum'
import { fetchPathByName, routerTurnByPath, renderLang, getUUID } from '@/utils'
import { createProject } from '@/api/http'

const { FishIcon, CloseIcon } = icon.ionicons5
const { StoreIcon, ObjectStorageIcon } = icon.carbon
const showRef = ref(false)

const initTable: any = inject('initTable');
const emit = defineEmits(['close'])

const props = defineProps({
  show: Boolean
})

const project_name = ref('')

const typeList = shallowRef([
  {
    title: renderLang('project.new_project'),
    key: ChartEnum.CHART_HOME_NAME,
    icon: FishIcon,
    disabled: false
  }
])

watch(props, newValue => {
  showRef.value = newValue.show
})

const onPositiveClick = () => {
  if (paramCheck()) {
    createProject({
      name: project_name.value,
      cover: '',
      content: ''
    })
      .then((res: any) => {
        //通知页面刷新
        initTable()
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        emit('close', false)
      })
  }
}

const paramCheck = () => {
  let flag = true

  if (project_name.value === '') {
    flag = false
    window['$message'].error('Project name is not filled in!')
  }

  return flag
}

// 关闭对话框
const closeHandle = () => {
  emit('close', false)
}

// 处理按钮点击
const btnHandle = (key: string) => {
  closeHandle()
  const id = getUUID()
  const path = fetchPathByName(ChartEnum.CHART_HOME_NAME, 'href')
  routerTurnByPath(path, [id], undefined, true)
}
</script>

<style lang="scss" scoped>
$cardWidth: 570px;

@include go('create-modal') {
  position: fixed;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);
  .card-box {
    width: $cardWidth;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0);
    @extend .go-transition;
    &:hover {
      @include hover-border-color('hover-border-color');
    }
    &-tite {
      font-size: 20px;
      line-height: 32px;
    }
    &-content {
      padding: 0px 10px;
      width: 100%;
    }
    &-con {
      height: 80px;
      width: 100%;
    }
    &-title {
      font-size: 18px;
      line-height: 32px;
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
