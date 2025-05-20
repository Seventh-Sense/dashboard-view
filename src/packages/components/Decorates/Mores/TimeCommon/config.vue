<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.font')">
      <SettingItem :name="t('dashboard.font_size')">
        <n-input-number
          v-model:value="optionData.timeSize"
          size="small"
          :min="1"
        ></n-input-number>
      </SettingItem>
      <SettingItem :name="t('dashboard.font_thickness')">
        <n-select
          v-model:value="optionData.fontWeight"
          size="small"
          :options="fontWeightOptions"
        />
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.spacing')">
      <SettingItem :name="t('dashboard.word_spacing')">
        <n-input-number
          v-model:value="optionData.timeTextIndent"
          size="small"
          :min="1"
        ></n-input-number>
      </SettingItem>
      <SettingItem :name="t('dashboard.line_spacing')">
        <n-input-number
          v-model:value="optionData.timeLineHeight"
          size="small"
          :min="1"
        ></n-input-number>
      </SettingItem>
    </SettingItemBox>

    <SettingItemBox :name="t('dashboard.color')">
      <SettingItem :name="t('dashboard.time')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.timeColor"
        ></n-color-picker>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.shadow')">
      <SettingItem>
        <n-space>
          <n-switch v-model:value="optionData.showShadow" size="small" />
          <n-text>{{t('dashboard.show_shadows')}}</n-text>
        </n-space>
      </SettingItem>
      <SettingItem name="x">
        <n-input-number v-model:value="optionData.hShadow" size="small"></n-input-number
      ></SettingItem>
      <SettingItem name="y">
        <n-input-number v-model:value="optionData.vShadow" size="small"></n-input-number
      ></SettingItem>
      <SettingItem :name="t('dashboard.fuzzy')">
        <n-input-number
          v-model:value="optionData.blurShadow"
          size="small"
        ></n-input-number
      ></SettingItem>
      <SettingItem :name="t('dashboard.color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.colorShadow"
        ></n-color-picker
      ></SettingItem>
    </SettingItemBox>
  </CollapseItem>
</template>
<script setup lang="ts">
import { PropType } from "vue";
import {
  CollapseItem,
  SettingItemBox,
  SettingItem,
} from "@/components/Pages/ChartItemSetting";
import { option, FontWeightEnum, FontWeightObject } from "./config";

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
});

const t = window['$t']

const fontWeightOptions = [
  {
    label: t('dashboard.normal'),
    value: FontWeightObject[FontWeightEnum.NORMAL],
  },
  {
    label: t('dashboard.bold'),
    value: FontWeightObject[FontWeightEnum.BOLD],
  },
];
</script>
