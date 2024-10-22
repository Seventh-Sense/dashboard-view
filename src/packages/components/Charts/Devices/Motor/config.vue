<template>
  <CollapseItem :name="`效果`" :expanded="true">
    <SettingItemBox name="数据">
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

const config = computed(() => {
  return props.optionData
})
</script>

<style lang="scss" scoped></style>
