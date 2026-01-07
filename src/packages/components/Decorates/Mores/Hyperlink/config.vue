<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.style')">
      <SettingItem>
        <n-color-picker
          v-model:value="optionData.backgroundColor"
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
        <n-radio-group v-model:value="mode" name="radiogroup">
          <n-space>
            <n-radio v-for="song in songs" :key="song.value" :value="song.value">
              {{ song.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </SettingItem>

      <SettingItem name=" ">
        <n-input v-if="mode === 1" v-model:value="optionData.href"/>
        <n-select
          v-else-if="mode === 2"
          v-model:value="optionData.href"
          :options="options"
          :style="{ width: '100%' }"
        />
      </SettingItem>
    </SettingItemBox>
  </CollapseItem>
</template>

<script setup lang="ts">
import { onMounted, PropType, ref, watch } from 'vue'
import { option } from './config'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { readProjectList } from '@/api/http'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const t = window['$t']

const options: any[] = []

const mode = ref(1)

const songs = [
  { label: t('dashboard.defined'), value: 1 },
  { label: t('dashboard.project'), value: 2 }
]

onMounted(() => {
  readProjects()
})

const readProjects = async () => {
  try {
    const res: any = await readProjectList()

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      return
    }

    //http://localhost:5173/#/chart/preview/bd3b8164-da5f-4252-a14f-3b185cdcbb19
    res.data.forEach((item: any) => {
      let href = window.location.origin + '/#/chart/preview/' + item.id
      options.push({
        label: item.name,
        value: href
      })
    })
  } catch (error) {
    console.error('Error read all projects:', error)
  }
}

watch(
  () => mode.value,
  newVal => {
    props.optionData.href = ''
  }
)
</script>

<style lang="scss" scoped></style>
