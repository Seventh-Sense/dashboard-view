<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.style')">
      <SettingItem>
        <n-color-picker
          v-model:value="optionData.background_0"
          size="small"
          :modes="['hex']"
        ></n-color-picker>
      </SettingItem>
      <SettingItem>
        <n-color-picker
          v-model:value="optionData.background_100"
          size="small"
          :modes="['hex']"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.radius')">
        <n-input-number v-model:value="optionData.radius" :min="0" size="small" />
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.title')" :alone="false">
      <SettingItem>
        <n-input v-model:value="optionData.text" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.font_size')">
        <n-input-number v-model:value="optionData.fontSize" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.fontColor"
        ></n-color-picker>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.hyperlink')" :alone="true">
      <SettingItem name=" ">
        <n-radio-group v-model:value="optionData.mode" name="radiogroup">
          <n-space>
            <n-radio v-for="song in songs" :key="song.value" :value="song.value">
              {{ song.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </SettingItem>

      <SettingItem name=" ">
        <n-input v-if="optionData.mode === 1" v-model:value="optionData.href" />
        <n-select
          v-else-if="optionData.mode === 2"
          v-model:value="optionData.href"
          :options="options"
          :style="{ width: '100%' }"
        />
        <n-input v-if="optionData.mode === 3" v-model:value="optionData.href" disabled />
      </SettingItem>
    </SettingItemBox>
  </CollapseItem>
</template>

<script setup lang="ts">
import { onMounted, PropType, ref, watch } from 'vue'
import { option } from './config'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { getLocalStorage } from '@/utils'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const t = window['$t']

const options = ref<any>([])

const songs = [
  { label: t('dashboard.homepage'), value: 3 },
  { label: t('dashboard.project'), value: 2 },
  { label: t('dashboard.defined'), value: 1 }
]

onMounted(() => {
  let config = getLocalStorage('ProjectInfo')

  if (config && Array.isArray(config)) {
    config.forEach(item => {
      //const href = `/#/chart/preview/${item.id}`
      options.value.push({ label: item.title, value: item.id})
    })
  }
})

watch(
  () => props.optionData.mode,
  newVal => {
    if (newVal === 3) {
      props.optionData.href = '/#/vant'
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped></style>
