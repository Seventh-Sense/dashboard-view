<template>
  <div class="go-project">
    <n-layout has-sider position="absolute" class="bg-transparent">
      <n-space vertical>
        <project-layout-sider></project-layout-sider>
      </n-space>
      <n-layout class="bg-transparent">
        <layout-header-pro></layout-header-pro>
        <n-layout
          id="go-project-content-top"
          class="content-top bg-transparent"
          position="absolute"
          :native-scrollbar="false"
        >
          <n-layout-content class="bg-transparent">
            <layout-transition-main>
              <router-view></router-view>
            </layout-transition-main>
          </n-layout-content>
        </n-layout>
        <!-- <n-layout-footer bordered position="absolute" class="go-footer">
          <div>服务器时间: 2023/12/12</div>
        </n-layout-footer> -->
      </n-layout>
    </n-layout>
    
  </div>
</template>

<script setup lang="ts">
import { ProjectLayoutSider } from './layout/components/ProjectLayoutSider'
import { LayoutHeaderPro } from '@/layout/components/LayoutHeaderPro'
import { LayoutTransitionMain } from '@/layout/components/LayoutTransitionMain/index'
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

@include go(footer) {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 32px;
  padding-right: 24px;
}

.bg-transparent {
  background-color: transparent;
}
</style>
