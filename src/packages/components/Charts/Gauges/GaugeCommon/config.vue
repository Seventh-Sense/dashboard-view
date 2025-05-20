<template>
  <CollapseItem :name="$t('dashboard.gauge_info')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem :name="t('dashboard.value')">
        <!-- 与 config.ts 里的 option 对应 -->
        <!-- n-input-number 是 NaiveUI 的控件 -->
        <n-input-number v-model:value="optionData.dataset" size="small"></n-input-number>
      </SettingItem>
      <setting-item :name="t('dashboard.unit')">
        <n-select v-model:value="optionData.unit" :options="units" size="small" />
      </setting-item>
      <SettingItem :name="t('dashboard.value_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.dataColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.unit_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.unitColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.value_font_size')">
        <n-input-number v-model:value="optionData.dataSize" size="small"></n-input-number>
      </SettingItem>
      <SettingItem :name="t('dashboard.unit_font_size')">
        <n-input-number v-model:value="optionData.unitSize" size="small"></n-input-number>
      </SettingItem>
      <SettingItem :name="t('dashboard.decimal_place')">
        <n-select v-model:value="optionData.decimal" :options="decimals" size="small" />
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.edit')" :alone="false">
      <SettingItem>
        <n-space>
          <n-switch v-model:value="optionData.isWrite" size="small"></n-switch>
          <n-text>
            {{ t('dashboard.open') }}
            <n-text :depth="3">{{ t('dashboard.writeable') }}</n-text>
          </n-text>
        </n-space>
      </SettingItem>
      <SettingItem :name="t('dashboard.steps')">
        <n-input-number v-model:value="optionData.step" size="small"></n-input-number>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.orbit')">
      <SettingItem :name="t('dashboard.progress_color_0')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.color[1]"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.progress_color_100')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.color[0]"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.orbit_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.railColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.orbit_width')">
        <n-input-number v-model:value="optionData.strokeWidth" size="small"></n-input-number>
      </SettingItem>
      <SettingItem :name="t('dashboard.orbital_edge')">
        <n-select v-model:value="optionData.linecap" :options="caps" size="small" />
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.scale')">
      <SettingItem :name="t('dashboard.min')">
        <n-input-number v-model:value="optionData.minValue" size="small"></n-input-number>
      </SettingItem>
      <SettingItem :name="t('dashboard.max')">
        <n-input-number v-model:value="optionData.maxValue" size="small"></n-input-number>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.display_scale')">
      <n-space>
        <n-switch v-model:value="optionData.isScale" size="small"></n-switch>
      </n-space>
    </SettingItemBox>
    <SettingItemBox v-if="optionData.isScale" name="">
      <SettingItem :name="t('dashboard.min_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.minColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.max_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.maxColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.min_font_size')">
        <n-input-number v-model:value="optionData.minSize" size="small"></n-input-number>
      </SettingItem>
      <SettingItem :name="t('dashboard.max_font_size')">
        <n-input-number v-model:value="optionData.maxSize" size="small"></n-input-number>
      </SettingItem>
      <SettingItem :name="t('dashboard.min')">
        <n-input-number v-model:value="optionData.minTop" size="small" placeholder="px">
          <template #prefix>
            <n-text depth="3">{{ t('dashboard.upp') }}</n-text>
          </template>
        </n-input-number>
      </SettingItem>
      <SettingItem name="">
        <n-input-number v-model:value="optionData.minLeft" size="small" placeholder="px">
          <template #prefix>
            <n-text depth="3">{{ t('dashboard.leftt') }}</n-text>
          </template>
        </n-input-number>
      </SettingItem>
      <SettingItem :name="t('dashboard.max')">
        <n-input-number v-model:value="optionData.maxTop" size="small" placeholder="px">
          <template #prefix>
            <n-text depth="3">{{ t('dashboard.upp') }}</n-text>
          </template>
        </n-input-number>
      </SettingItem>
      <SettingItem name="">
        <n-input-number v-model:value="optionData.maxLeft" size="small" placeholder="px">
          <template #prefix>
            <n-text depth="3">{{ t('dashboard.right') }}</n-text>
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

const t = window['$t']

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})
</script>

<style lang="scss" scoped></style>
