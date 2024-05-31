<template>
  <div class="go-chart-configurations-data">
    <setting-item-box :name="$t('dashboard.point_bind')" :alone="true">
      <n-cascader
        size="small"
        v-model:value="value"
        placeholder=""
        expand-trigger="hover"
        :options="options"
        check-strategy="all"
        :show-path="true"
        :filterable="false"
        @update:value="handleUpdateValue"
      />
    </setting-item-box>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CascaderOption } from 'naive-ui'
import { SettingItemBox } from '@/components/Pages/ChartItemSetting'

const value = ref(null)
const options: CascaderOption[] = []

const handleUpdateValue = (value: string, option: CascaderOption) => {
  console.log(value, option)
}
</script>

<style lang="scss" scoped></style>
