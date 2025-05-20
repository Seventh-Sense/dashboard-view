<template>
  <!-- <div v-show="isGroup">
    <n-divider n-divider style="margin: 10px 0"></n-divider>
    <n-tag type="warning">解散分组「 {{ isCanvas ? '滤镜' : '滤镜 / 变换' }} 」也将消失!</n-tag>
  </div> -->

  <collapse-item :name="isCanvas ? t('dashboard.filter') : t('dashboard.transform')">
    <template #header>
      <!-- <n-switch v-model:value="chartStyles.filterShow" size="small"></n-switch> -->
    </template>
    <!-- <setting-item-box name="色相" :alone="true">
      <setting-item :name="`值：${chartStyles.hueRotate}deg`">
        <n-slider
          v-model:value="chartStyles.hueRotate"
          :step="3"
          :min="0"
          :max="360"
          :format-tooltip="degFormatTooltip"
        ></n-slider>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="饱和度" :alone="true">
      <setting-item :name="`值：${(parseFloat(String(chartStyles.saturate)) * 100).toFixed(0)}%`">
        <n-slider
          v-model:value="chartStyles.saturate"
          :step="0.1"
          :min="0"
          :max="2"
          :format-tooltip="sliderFormatTooltip"
        ></n-slider>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="对比度" :alone="true">
      <setting-item :name="`值：${(parseFloat(String(chartStyles.contrast)) * 100).toFixed(0)}%`">
        <n-slider
          v-model:value="chartStyles.contrast"
          :step="0.1"
          :min="0"
          :max="2"
          :format-tooltip="sliderFormatTooltip"
        ></n-slider>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="亮度" :alone="true">
      <setting-item :name="`值：${(parseFloat(String(chartStyles.brightness)) * 100).toFixed(0)}%`">
        <n-slider
          v-model:value="chartStyles.brightness"
          :step="0.1"
          :min="0"
          :max="2"
          :format-tooltip="sliderFormatTooltip"
        ></n-slider>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="透明度" :alone="true">
      <setting-item :name="`值：${(parseFloat(String(chartStyles.opacity)) * 100).toFixed(0)}%`">
        <n-slider
          v-model:value="chartStyles.opacity"
          :step="0.1"
          :min="0"
          :max="1"
          :format-tooltip="sliderFormatTooltip"
        ></n-slider>
      </setting-item>
    </setting-item-box> -->

    <!--  预设滤镜  -->
    <!-- <div v-if="presetImageList.length" class="preset-filter">
      <n-image
        class="preset-img"
        width="46"
        preview-disabled
        object-fit="scale-down"
        v-for="(item, index) in presetImageList"
        :key="index"
        :class="{ 'active-preset': item.hueRotate === chartStyles.hueRotate }"
        :style="{ filter: `hue-rotate(${item.hueRotate}deg)` }"
        :src="item.src"
        @click="() => (chartStyles.hueRotate = item.hueRotate)"
      ></n-image>
    </div> -->

    <!-- 混合模式 -->
    <!-- <setting-item-box v-if="!isCanvas" :alone="true">
      <template #name>
        <n-text>混合</n-text>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-icon size="21" :depth="3">
              <help-outline-icon></help-outline-icon>
            </n-icon>
          </template>
          <n-text>视频组件需要底色透明一般选中滤色</n-text>
        </n-tooltip>
      </template>
      <setting-item>
        <n-select
          v-model:value="chartStyles.blendMode"
          size="small"
          filterable
          :options="BlendModeEnumList"
        ></n-select>
      </setting-item>
    </setting-item-box> -->

    <!-- 变换 -->
    <setting-item-box v-if="!isCanvas" :name="t('dashboard.rotate')">
      <setting-item :name="t('dashboard.z_rotate')">
        <!-- 透明度 -->
        <n-input-number
          v-model:value="chartStyles.rotateZ"
          :min="0"
          :max="360"
          size="small"
          :placeholder="t('dashboard.angle')"
        ></n-input-number>
      </setting-item>
      <setting-item :name="t('dashboard.x_rotate')">
        <!-- 透明度 -->
        <n-input-number
          v-model:value="chartStyles.rotateX"
          :min="0"
          :max="360"
          size="small"
          :placeholder="t('dashboard.angle')"
        ></n-input-number>
      </setting-item>
      <setting-item :name="t('dashboard.y_rotate')">
        <!-- 透明度 -->
        <n-input-number
          v-model:value="chartStyles.rotateY"
          :min="0"
          :max="360"
          size="small"
          :placeholder="t('dashboard.angle')"
        ></n-input-number>
      </setting-item>
    </setting-item-box>

    <!-- 倾斜 -->
    <setting-item-box v-if="!isCanvas" :name="t('dashboard.tilt')">
      <setting-item :name="t('dashboard.x_tilt')">
        <n-input-number
          v-model:value="chartStyles.skewX"
          :min="0"
          :max="360"
          size="small"
          :placeholder="t('dashboard.angle')"
        ></n-input-number>
      </setting-item>
      <setting-item :name="t('dashboard.y_tilt')">
        <n-input-number
          v-model:value="chartStyles.skewY"
          :min="0"
          :max="360"
          size="small"
          :placeholder="t('dashboard.angle')"
        ></n-input-number>
      </setting-item>
    </setting-item-box>

    <!-- 提示 -->
    <!-- <n-tag type="warning">{{t('dashboard.filter_tip_1')}}</n-tag> -->
  </collapse-item>
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue'
import { PickCreateComponentType, BlendModeEnumList } from '@/packages/index.d'
import { SettingItemBox, SettingItem, CollapseItem } from '@/components/Pages/ChartItemSetting'
import { icon } from '@/plugins'
import logoImg from '@/assets/logo.png'
import { useDesignStore } from '@/store/modules/designStore/designStore'

const props = defineProps({
  isGroup: {
    type: Boolean,
    required: false
  },
  isCanvas: {
    type: Boolean,
    default: false
  },
  chartStyles: {
    type: Object as PropType<Omit<PickCreateComponentType<'styles'>, 'animations'>>,
    required: true
  }
})
const t = window['$t']

const { HelpOutlineIcon } = icon.ionicons5

// 百分比格式化 person
const sliderFormatTooltip = (v: string) => {
  return `${(parseFloat(v) * 100).toFixed(0)}%`
}

// 角度格式化
const degFormatTooltip = (v: string) => {
  return `${v}deg`
}

// 预设滤镜
interface presetImageData {
  index: number
  src: string
  hueRotate: number
}

const presetImageList = ref([] as presetImageData[])
for (let i = 1; i <= 12; i++) {
  presetImageList.value.push({
    index: i,
    src: logoImg,
    hueRotate: i * 30
  })
}
</script>

<style lang="scss" scoped>
// 预设滤镜
.preset-filter {
  margin: 20px 0 10px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .preset-img {
    margin-bottom: 10px;
    padding: 2px;
    border-radius: 6px;
    transition: 0.2s all;
    cursor: pointer;
    &:hover {
      box-shadow: 0 0 0 2px #66a9c9;
    }
  }
  .active-preset {
    box-shadow: 0 0 0 2px #66a9c9;
  }
}
</style>
