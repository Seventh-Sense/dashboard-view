<template>
  <div class="go-project">
    <n-layout has-sider position="absolute" class="bg-transparent">
      <n-layout class="bg-transparent">
        <div class="header">
          <div>
            <img width="48" height="48" :src="SVG_ICON.card_icons.logo" style="cursor: pointer;"/>
          </div>
          <div>
            <go-lang-select v-if="!isChart"></go-lang-select>
          </div>
        </div>
        <RemoteObject />
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { RemoteObject } from '../ObjectManage/RemoteObject'
import { ChartEnum } from '@/enums/pageEnum'
import { GoLangSelect } from '@/components/GoLangSelect'
import SVG_ICON from '@/svg/SVG_ICON'

const route = useRoute()

const isChart = computed(() => {
  //console.log(route.name, route.name === ChartEnum.CHART_HOME_NAME)
  return route.name === ChartEnum.CHART_HOME_NAME
})
</script>

<style lang="scss" scoped>
@include go(project) {
  @include background-image('background-image-new');
  height: 100vh;
  .content-top {
    top: $--header-height;
    margin-top: 1px;
  }
}

.header {
  height: 80px;
  background-color: $--color-dark-top;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.bg-transparent {
  background-color: transparent;
}
</style>
