<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.value')">
      <SettingItem name="">
        <n-switch v-model:value="config.dataset" size="small" />
      </SettingItem>
    </SettingItemBox>
  </CollapseItem>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { CollapseItem, SettingItemBox, SettingItem } from '../../../../../components/Pages/ChartItemSetting'
import { GlobalThemeJsonType } from '../../../../../settings/chartThemes'

const props = defineProps({
  optionData: {
    type: Object as PropType<GlobalThemeJsonType>,
    required: true
  }
})

const t = window['$t']
const config = computed(() => {
  return props.optionData
})
</script>

<style lang="scss" scoped>
</style>
