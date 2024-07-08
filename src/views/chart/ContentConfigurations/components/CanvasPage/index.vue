<template>
  <div class="go-canvas-setting">
    <n-form inline label-width="auto" size="small" label-placement="left">
      <n-form-item :label="$t('dashboard.width')">
        <!-- 尺寸选择 -->
        <n-input-number
          size="small"
          v-model:value="canvasConfig.width"
          :disabled="editCanvas.lockScale"
          :validator="validator"
          @update:value="changeSizeHandle"
        ></n-input-number>
      </n-form-item>
      <n-form-item :label="$t('dashboard.height')">
        <n-input-number
          size="small"
          v-model:value="canvasConfig.height"
          :disabled="editCanvas.lockScale"
          :validator="validator"
          @update:value="changeSizeHandle"
        ></n-input-number>
      </n-form-item>
    </n-form>

    <div class="upload-box">
      <n-upload
        v-model:file-list="uploadFileListRef"
        :show-file-list="false"
        :customRequest="customRequest"
        :onBeforeUpload="beforeUploadHandle"
      >
        <n-upload-dragger>
          <img
            v-if="canvasConfig.backgroundImage"
            class="upload-show"
            :src="canvasConfig.backgroundImage"
            alt="背景"
          />
          <div class="upload-img" v-show="!canvasConfig.backgroundImage">
            <img src="@/assets/images/canvas/noImage.png" />
            <n-text class="upload-desc" depth="3">
              {{ $t('dashboard.background_prev') }} {{ backgroundImageSize }}M
              {{ $t('dashboard.background_last') }}
            </n-text>
          </div>
        </n-upload-dragger>
      </n-upload>
    </div>
    <n-space vertical :size="12">
      <n-space>
        <n-text>{{ $t('dashboard.background_color') }}</n-text>
      </n-space>
      <n-space>
        <div class="picker-height">
          <n-color-picker
            v-if="!switchSelectColorLoading"
            size="small"
            style="width: 250px"
            v-model:value="canvasConfig.background"
            :showPreview="true"
            :swatches="swatchesColors"
          ></n-color-picker>
        </div>
      </n-space>
      <n-space>
        <n-text>{{ $t('dashboard.application_type') }}</n-text>
      </n-space>
      <n-space>
        <n-select
          size="small"
          style="width: 250px"
          v-model:value="selectColorValue"
          :disabled="!canvasConfig.backgroundImage"
          :options="selectColorOptions"
          @update:value="selectColorValueHandle"
        />
      </n-space>
      <n-space>
        <n-text>{{ $t('dashboard.background_control') }}</n-text>
      </n-space>
      <n-space>
        <n-button
          class="clear-btn"
          size="small"
          :disabled="!canvasConfig.backgroundImage"
          @click="clearImage"
          
        >
          {{ $t('dashboard.clear_background') }}
        </n-button>
        <n-button
          class="clear-btn"
          size="small"
          :disabled="!canvasConfig.background"
          @click="clearColor"
        >
          {{ $t('dashboard.clear_color') }}
        </n-button>
      </n-space>
      <n-space>
        <n-text>{{ $t('dashboard.adaptate_mode') }}</n-text>
      </n-space>
      <n-space>
        <n-button-group>
          <n-button
            v-for="item in previewTypeList"
            :key="item.key"
            :type="canvasConfig.previewScaleType === item.key ? 'primary' : 'tertiary'"
            ghost
            size="small"
            @click="selectPreviewType(item.key)"
          >
            <n-tooltip :show-arrow="false" trigger="hover">
              <template #trigger>
                <n-icon class="select-preview-icon" size="18">
                  <component :is="item.icon"></component>
                </n-icon>
              </template>
              {{ item.desc }}
            </n-tooltip>
          </n-button>
        </n-button-group>
      </n-space>
    </n-space>

    <!-- 滤镜 -->
    <!-- <styles-setting :isCanvas="true" :chartStyles="canvasConfig"></styles-setting> -->
    <n-divider style="margin: 10px 0"></n-divider>

    <!-- 主题选择和全局配置 -->
    <!-- <n-tabs class="tabs-box" size="small" type="segment">
      <n-tab-pane
        v-for="item in globalTabList"
        :key="item.key"
        :name="item.key"
        size="small"
        display-directive="show:lazy"
      >
        <template #tab>
          <n-space>
            <span>{{ item.title }}</span>
            <n-icon size="16" class="icon-position">
              <component :is="item.icon"></component>
            </n-icon>
          </n-space>
        </template>
        <component :is="item.render"></component>
      </n-tab-pane>
    </n-tabs> -->
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { backgroundImageSize } from '@/settings/designSetting'
import { swatchesColors } from '@/settings/chartThemes/index'
import { FileTypeEnum } from '@/enums/fileTypeEnum'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { EditCanvasConfigEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
import { StylesSetting } from '@/components/Pages/ChartItemSetting'
import { UploadCustomRequestOptions } from 'naive-ui'
import { fileToUrl, fileTobase64, loadAsyncComponent, renderLang } from '@/utils'
import { PreviewScaleEnum } from '@/enums/styleEnum'
import { icon } from '@/plugins'

const { ColorPaletteIcon } = icon.ionicons5
const { ScaleIcon, FitToScreenIcon, FitToHeightIcon, FitToWidthIcon } = icon.carbon

const chartEditStore = useChartEditStore()
const canvasConfig = chartEditStore.getEditCanvasConfig
const editCanvas = chartEditStore.getEditCanvas

const uploadFileListRef = ref()
const switchSelectColorLoading = ref(false)
const selectColorValue = ref(0)

const ChartThemeColor = loadAsyncComponent(() => import('./components/ChartThemeColor/index.vue'))

// 默认应用类型
const selectColorOptions = [
  {
    label: renderLang('dashboard.applied_color'),
    value: 0
  },
  {
    label: renderLang('dashboard.applied_background'),
    value: 1
  }
]

const globalTabList = [
  {
    key: 'ChartTheme',
    title: '主题颜色',
    icon: ColorPaletteIcon,
    render: ChartThemeColor
  }
]
const t = window['$t']
const previewTypeList = [
  {
    key: PreviewScaleEnum.FIT,
    title: '自适应',
    icon: ScaleIcon,
    desc: t('dashboard.self_adaptation')
  },
  {
    key: PreviewScaleEnum.SCROLL_Y,
    title: 'Y轴滚动',
    icon: FitToWidthIcon,
    desc: t('dashboard.Yaxis_rolling')
  },
  {
    key: PreviewScaleEnum.SCROLL_X,
    title: 'X轴滚动',
    icon: FitToHeightIcon,
    desc: t('dashboard.Xaxis_rolling')
  },
  {
    key: PreviewScaleEnum.FULL,
    title: '铺满',
    icon: FitToScreenIcon,
    desc: t('dashboard.carpeting')
  }
]

watch(
  () => canvasConfig.selectColor,
  newValue => {
    selectColorValue.value = newValue ? 0 : 1
  },
  {
    immediate: true
  }
)

// 画布尺寸规则
const validator = (x: number) => x > 50

// 修改尺寸
const changeSizeHandle = () => {
  chartEditStore.computedScale()
}

// 上传图片前置处理
//@ts-ignore
const beforeUploadHandle = async ({ file }) => {
  uploadFileListRef.value = []
  const type = file.file.type
  const size = file.file.size

  if (size > 1024 * 1024 * backgroundImageSize) {
    window['$message'].warning(renderLang('message.picture_error_text'))
    return false
  }
  if (type !== FileTypeEnum.PNG && type !== FileTypeEnum.JPEG && type !== FileTypeEnum.GIF) {
    window['$message'].warning(renderLang('message.picture_error_text1'))
    return false
  }
  return true
}

// 应用颜色
const selectColorValueHandle = (value: number) => {
  canvasConfig.selectColor = value == 0
}

// 清除背景
const clearImage = () => {
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.BACKGROUND_IMAGE, undefined)
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.SELECT_COLOR, true)
}

// 启用/关闭 颜色（强制更新）
const switchSelectColorHandle = () => {
  switchSelectColorLoading.value = true
  setTimeout(() => {
    switchSelectColorLoading.value = false
  })
}

// 清除颜色
const clearColor = () => {
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.BACKGROUND, undefined)
  if (canvasConfig.backgroundImage) {
    chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.SELECT_COLOR, false)
  }
  switchSelectColorHandle()
}

// 自定义上传操作
const customRequest = (options: UploadCustomRequestOptions) => {
  const { file } = options
  nextTick(() => {
    if (file.file) {
      //const ImageUrl = fileToUrl(file.file)

      fileTobase64(file.file, (ImageUrl: string) => {
        console.log(ImageUrl)
        chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.BACKGROUND_IMAGE, ImageUrl)
        chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.SELECT_COLOR, false)
      })
    } else {
      window['$message'].error(renderLang('message.picture_error_text2'))
    }
  })
}

// 选择适配方式
const selectPreviewType = (key: PreviewScaleEnum) => {
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.PREVIEW_SCALE_TYPE, key)
}
</script>

<style lang="scss" scoped>
$uploadWidth: 326px;
$uploadHeight: 193px;
@include go(canvas-setting) {
  padding-top: 20px;
  .upload-box {
    cursor: pointer;
    margin-bottom: 20px;
    @include deep() {
      .n-upload-dragger {
        padding: 5px;
        width: $uploadWidth;
        background-color: rgba(0, 0, 0, 0);
      }
    }
    .upload-show {
      width: -webkit-fill-available;
      height: $uploadHeight;
      border-radius: 5px;
    }
    .upload-img {
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        height: 150px;
      }
      .upload-desc {
        padding: 10px 0;
      }
    }
  }
  .icon-position {
    padding-top: 2px;
  }
  .picker-height {
    min-height: 35px;
  }
  .clear-btn {
    padding-left: 2.25em;
    padding-right: 2.25em;
  }
  // .select-preview-icon {
  //   padding-right: 0.68em;
  //   padding-left: 0.68em;
  // }
  .tabs-box {
    margin-top: 20px;
  }
}
</style>
