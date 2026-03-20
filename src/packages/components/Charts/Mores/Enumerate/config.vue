<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem :name="t('dashboard.value')">
        <n-input v-model:value="optionData.dataset" size="small"></n-input>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.style')">
      <SettingItem :name="t('dashboard.color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.font_size')">
        <n-input-number v-model:value="optionData.fontSize" size="small"></n-input-number>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox v-for="option in optionData.options" :name="t('dashboard.enumerate')">
      <SettingItem :name="t('dashboard.text')">
        <n-input v-model:value="option.label" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.value')">
        <n-input v-model:value="option.value" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.color')">
        <n-color-picker size="small" :modes="['hex']" v-model:value="option.color"></n-color-picker>
      </SettingItem>
      <SettingItem>
        <n-icon size="18" color="white" @click="onDelete(option.key)" style="cursor: pointer">
          <DeleteIcon />
        </n-icon>
      </SettingItem>
    </SettingItemBox>
    <div @click="add" class="btn">
      <n-icon size="18" color="white">
        <AddIcon />
      </n-icon>
    </div>
  </CollapseItem>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import {
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '../../../../../components/Pages/ChartItemSetting'
import { option } from './config'
import { icon } from '@/plugins'

const { AddIcon } = icon.ionicons5
const { DeleteIcon } = icon.carbon

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const t = window['$t']

const add = () => {
  props.optionData.options.push({
    key: new Date().getTime(),
    label: '',
    value: '',
    color: '#ffffff'
  })
}

const onDelete = (key: number) => {
  props.optionData.options = props.optionData.options.filter((item: any) => item.key !== key)
}
</script>

<style lang="scss" scoped>
.btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
  height: 32px;
  background-color: #409eff;
  color: white;
  border-radius: 4px;
  justify-content: center;
}
</style>
