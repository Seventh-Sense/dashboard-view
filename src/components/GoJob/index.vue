<template>
  <n-modal :show="isShowModal">
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
          <span class="modal-title">
            {{ $t('project.task') }}
          </span>
          <n-icon size="40" :depth="1" @click="onClose" style="cursor: pointer">
            <CloseOutlineIcon />
          </n-icon>
        </n-space>
      </template>
      <div style="height: 550px; overflow-y: auto; overflow-x: hidden">
        <div class="modal-top">
          <n-button class="modal-button-ok" @click="onAdd">
            {{ $t('global.r_create') }}
          </n-button>
        </div>
        <n-collapse>
          <template #header-extra>
            <div></div>
          </template>
          <template #arrow>
            <div></div>
          </template>
          <n-collapse-item v-for="job in jobData" :name="job.name">
            <template #header>
              <n-space align="center" justify="space-between" style="height: 52px; width: 740px">
                <div style="display: flex; align-items: center">
                  <img width="24" height="24" :src="SVG_ICON.card_icons.separator" />
                  <span>{{ job.name }}</span>
                </div>
                <img
                  width="24"
                  height="24"
                  :src="SVG_ICON.card_icons.delete_one"
                  @click.stop="onDelete(job)"
                />
              </n-space>
            </template>
            <div class="modal-list">
              <!-- <div v-for="(value, key) in job">
                <div class="modal-list-key">{{ key }}</div>
                <div class="modal-list-value">{{ value }}</div>
              </div> -->
              <div class="modal-list-key">ID</div>
              <div class="modal-list-value">{{ job['id'] }}</div>
              <div class="modal-list-key">Trigger</div>
              <div class="modal-list-value">{{ job['kwargs'].ttl }}</div>
              <div class="modal-list-key">Next Run Time</div>
              <div class="modal-list-value">{{ job['next_run_time'] }}</div>
            </div>
          </n-collapse-item>
        </n-collapse>
      </div>

      <!-- <template #footer>
        <n-space justify="end">
          <n-button class="modal-button-ok" @click="onSubmit">
            {{ $t('global.r_ok') }}
          </n-button>
        </n-space>
      </template> -->
    </n-card>
  </n-modal>
  <Job v-if="jobShow" v-model:isShowModal="jobShow" :dataList="jobData" />
</template>

<script setup lang="ts">
import { deleteJob, readAllJobs } from '@/api/http'
import SVG_ICON from '@/svg/SVG_ICON'
import { onMounted, ref, watch } from 'vue'
import { Job } from './Job'
import { icon } from '@/plugins'
import { getLocalStorage } from '@/utils'

const { CloseOutlineIcon } = icon.ionicons5

let emit = defineEmits(['update:isShowModal'])

const props = defineProps({
  isShowModal: {
    type: Boolean,
    required: true
  }
})

const theme = ref(getLocalStorage('GO_DESIGN'))
const listColor = ref('rgba(32, 30, 43, 1)')

const jobShow = ref(false)
const jobData = ref<any>([])

onMounted(() => {
  setGlobalCssVar()
  readTasks()
})

const readTasks = async () => {
  try {
    const res: any = await readAllJobs()

    if (res && res.length > 0) {
      jobData.value = res
    }
  } catch (e) {
    console.error('Failed to read job:', e)
  }
}

const onAdd = () => {
  jobShow.value = true
}

const onDelete = async (task: any) => {
  try {
    const res: any = await deleteJob(task.id)

    if (res && res.job === task.id) {
      jobData.value = jobData.value.filter((item: any) => item.id !== task.id)
    }
  } catch (e) {
    console.error('Failed to delete jobs:', e)
  }
}

const onSubmit = () => {
  emit('update:isShowModal', false)
}

const onClose = () => {
  emit('update:isShowModal', false)
}

watch(
  () => jobShow.value,
  newVal => {
    if (!newVal) {
      readTasks()
    }
  }
)

const setGlobalCssVar = () => {
  document.documentElement.style.setProperty('--list-color', listColor.value)
}

watch(
  () => theme.value,
  newVal => {
    if (newVal) {
      let name = newVal!.themeName
      if (name === 'light') {
        listColor.value = 'rgba(255, 255, 255, 0.80)'
      } else if (name === 'dark') {
        listColor.value = 'rgba(32, 30, 43, 1)'
      }
    }
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss" scoped>
.modal {
  @include fetch-bg-color('modal-content-background');
  width: 800px;
  backdrop-filter: blur(50px);
  border-radius: 18px;

  &-top {
    padding: 0 18px;
    height: 48px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  &-title {
    @include fetch-theme-custom('color', 'modal-font-color');
    font-size: 20px;
    font-style: normal;
    text-transform: none;
    font-weight: bold;
  }

  &-button-ok {
    width: 72px;
    height: 32px;
    border: 0;
    border-radius: 2px;
  }

  &-list {
    @include fetch-theme-custom('color', 'modal-font-color');
    border-radius: 8px;
    padding: 12px 18px;

    &-key {
      @include fetch-theme-custom('color', 'modal-font-color');
      font-weight: 400;
      font-size: 12px;
      line-height: 17px;
      text-align: left;
      font-style: normal;
      margin-bottom: 4px;
    }

    &-value {
      @include fetch-theme-custom('color', 'modal-font-color');
      @include fetch-theme-custom('border-bottom-color', 'modal-font-color');
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      text-align: left;
      font-style: normal;
      margin-bottom: 12px;
      border-bottom-style: solid;
      border-bottom-width: 1px;
    }
  }
}

:deep(.n-collapse-item) {
  border-radius: 8px;
  background-color: var(--list-color);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.13);
}

:deep(.n-collapse-item__header) {
  height: 52px;
  width: 100%;
  padding: 0 !important;
}

:deep(.n-collapse) {
  padding-right: 10px;
}

:deep(.n-collapse-item__content-inner) {
  padding-top: 0 !important;
}
</style>
