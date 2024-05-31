<template>
  <layout-header>
    <template #left>
      <slot name="left"></slot>
    </template>
    <template #center>
      <slot name="center"></slot>
    </template>
    <template #ri-left>
      <slot name="ri-left"></slot>
    </template>
    <template #ri-right>
      <go-user-info v-if="!isChart"></go-user-info>
      <slot name="ri-right"></slot>
    </template>
  </layout-header>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { LayoutHeader } from '@/layout/components/LayoutHeader'
import { GoUserInfo } from '@/components/GoUserInfo'
import { useRoute } from 'vue-router'
import { ChartEnum } from '@/enums/pageEnum'

const route = useRoute()

const isChart = computed(() => {
  console.log(route.name, route.name === ChartEnum.CHART_HOME_NAME)
  return route.name === ChartEnum.CHART_HOME_NAME
})
</script>
