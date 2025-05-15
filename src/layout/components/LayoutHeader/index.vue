<template>
  <n-layout-header bordered class="go-header">
    <header class="go-header-box">
      <div class="header-item left">
        <n-space>
          <slot name="left"></slot>
          <img
            v-if="isProject"
            src="~@/assets/images/login/logo_dark.png"
            height="32"
            width="200"
          />
        </n-space>
      </div>
      <div class="header-item center">
        <slot name="center"></slot>
      </div>
      <div class="header-item right">
        <n-space>
          <slot name="ri-left"></slot>
          <go-lang-select v-if="!isChart"></go-lang-select>
          <!-- <theme-color-select v-if="!isChart"></theme-color-select> -->
          <!-- <go-theme-select v-if="!isChart"></go-theme-select> -->
          <slot name="ri-right"></slot>
        </n-space>
      </div>
    </header>
  </n-layout-header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { GoThemeSelect } from '@/components/GoThemeSelect'
import { GoLangSelect } from '@/components/GoLangSelect'
import { ThemeColorSelect } from '@/components/Pages/ThemeColorSelect'
import { PageEnum, ChartEnum } from '@/enums/pageEnum'

const route = useRoute()

const isProject = computed(() => {
  return route.fullPath === PageEnum.BASE_LOGIN
})

//
const isChart = computed(() => {
  //console.log(route.name, route.name === ChartEnum.CHART_HOME_NAME)
  return route.name === ChartEnum.CHART_HOME_NAME
})
</script>

<style lang="scss" scoped>
$min-width: 520px;
@include go(header) {
  &-box {
    display: grid;
    grid-template-columns: repeat(3, 33%);
    &.is-project {
      grid-template-columns: none;
    }
    .header-item {
      display: flex;
      align-items: center;
      //min-width: $min-width;
      &.left {
        justify-content: start;
      }
      &.center {
        justify-content: center;
      }
      &.right {
        justify-content: end;
      }
    }
    height: $--header-height;
    padding: 0 12px;
  }
}
</style>
