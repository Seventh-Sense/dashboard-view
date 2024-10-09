<template>
  <CollapseItem name="仪表盘" :expanded="true">
    <SettingItemBox name="内容">
      <SettingItem name="数值">
        <!-- 与 config.ts 里的 option 对应 -->
        <!-- n-input-number 是 NaiveUI 的控件 -->
        <n-input-number v-model:value="optionData.dataset" size="small"></n-input-number>
      </SettingItem>
      <setting-item name="单位">
        <n-select v-model:value="optionData.unit" :options="units" size="small" />
      </setting-item>
      <SettingItem name="数值颜色">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.dataColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem name="单位颜色">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.unitColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem name="数值字体大小">
        <n-input-number v-model:value="optionData.dataSize" size="small"></n-input-number>
      </SettingItem>
      <SettingItem name="单位字体大小">
        <n-input-number v-model:value="optionData.unitSize" size="small"></n-input-number>
      </SettingItem>
      <SettingItem name="小数位">
        <n-select v-model:value="optionData.decimal" :options="decimals" size="small" />
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox name="编辑" :alone="false">
      <SettingItem>
        <n-space>
          <n-switch v-model:value="optionData.isWrite" size="small"></n-switch>
          <n-text>开启<n-text :depth="3">可写模式</n-text></n-text>
        </n-space>
      </SettingItem>
      <SettingItem name="步数">
        <n-input-number v-model:value="optionData.step" size="small"></n-input-number>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox name="轨道">
      <SettingItem name="0% 进度条颜色">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.color[1]"
        ></n-color-picker>
      </SettingItem>
      <SettingItem name="100% 进度条颜色">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.color[0]"
        ></n-color-picker>
      </SettingItem>
      <SettingItem name="轨道颜色">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.railColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem name="轨道宽度">
        <n-input-number v-model:value="optionData.strokeWidth" size="small"></n-input-number>
      </SettingItem>
      <SettingItem name="轨道边缘">
        <n-select v-model:value="optionData.linecap" :options="caps" size="small" />
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox name="刻度">
      <SettingItem>
        <n-space>
          <n-switch v-model:value="optionData.isScale" size="small"></n-switch>
        </n-space>
      </SettingItem>
      
    </SettingItemBox>
    <SettingItemBox v-if="optionData.isScale" name="">
      <SettingItem name="最小值">
        <n-input-number v-model:value="optionData.minValue" size="small"></n-input-number>
      </SettingItem>
      <SettingItem name="最大值">
        <n-input-number v-model:value="optionData.maxValue" size="small"></n-input-number>
      </SettingItem>
      <SettingItem name="最小值颜色">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.minColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem name="最大值颜色">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.maxColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem name="最小值字体">
        <n-input-number v-model:value="optionData.minSize" size="small"></n-input-number>
      </SettingItem>
      <SettingItem name="最大值字体">
        <n-input-number v-model:value="optionData.maxSize" size="small"></n-input-number>
      </SettingItem>
      <SettingItem name="最小值">
        <n-input-number v-model:value="optionData.minTop" size="small" placeholder="px">
          <template #prefix>
            <n-text depth="3">上</n-text>
          </template>
        </n-input-number>
      </SettingItem>
      <SettingItem name="">
        <n-input-number v-model:value="optionData.minLeft" size="small" placeholder="px">
          <template #prefix>
            <n-text depth="3">左</n-text>
          </template>
        </n-input-number>
      </SettingItem>
      <SettingItem name="最大值">
        <n-input-number v-model:value="optionData.maxTop" size="small" placeholder="px">
          <template #prefix>
            <n-text depth="3">上</n-text>
          </template>
        </n-input-number>
      </SettingItem>
      <SettingItem name="">
        <n-input-number v-model:value="optionData.maxLeft" size="small" placeholder="px">
          <template #prefix>
            <n-text depth="3">右</n-text>
          </template>
        </n-input-number>
      </SettingItem>
    </SettingItemBox>
  </CollapseItem>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { option, units, caps, decimals } from './config'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})
</script>

<style lang="scss" scoped></style>
