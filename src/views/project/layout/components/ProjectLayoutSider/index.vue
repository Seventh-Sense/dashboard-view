<template>
  <n-layout-sider
    class="go-project-sider"
    collapse-mode="width"
    :collapsed="collapsed"
    :native-scrollbar="false"
    :collapsed-width="getAsideCollapsedWidth"
    :width="asideWidth"
    @collapse="collapsed = true"
    @expand="collapsed = false"
  >
    <div class="go-project-sider-flex">
      <div class="go-project-sider-flex-top"></div>
      <div
        :class="
          collapsed
            ? 'go-project-sider-flex-content collapsed-width'
            : 'go-project-sider-flex-content uncollapsed-width'
        "
      >
        <n-space vertical class="go-project-sider-top">
          <img
            width="48"
            height="48"
            :src="SVG_ICON.card_icons.logo"
            @click="onCollapse"
            style="cursor: pointer"
          />
          <img v-if="!collapsed" :src="SVG_ICON.card_icons.XPlay" height="48" width="100" />
          <!-- <project-layout-create :collapsed="collapsed"></project-layout-create> -->
          <!-- <img src="~@/assets/images/tips/loadingSvg.svg" height="32" width="200" /> -->
        </n-space>
        <n-menu
          v-model:value="menuValue"
          :options="menuOptionsInit(menuValue)"
          :collapsed-width="getAsideCollapsedWidth"
          :collapsed-icon-size="24"
          :icon-size="32"
          :root-indent="16"
          :default-expanded-keys="defaultExpandedKeys"
          :on-update:value="onSelcet"
        ></n-menu>
      </div>
    </div>
  </n-layout-sider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, toRefs } from 'vue'
import { asideWidth } from '@/settings/designSetting'
import { useRoute } from 'vue-router'
import { useSettingStore } from '@/store/modules/settingStore/settingStore'
import { menuOptionsInit, expandedKeys } from './menu'
import SVG_ICON from '@/svg/SVG_ICON'
import { MenuOption } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()
const collapsed = ref<boolean>(false)
const { getAsideCollapsedWidth } = toRefs(useSettingStore())

const route = useRoute()
const menuValue = ref(route.name)

//const menuOptions = menuOptionsInit()

const defaultExpandedKeys = expandedKeys()

const watchWidth = () => {
  const Width = document.body.clientWidth
  if (Width <= 950) {
    collapsed.value = true
  } else collapsed.value = false
}

onMounted(() => {
  window.addEventListener('resize', watchWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', watchWidth)
})

const onCollapse = () => {
  collapsed.value = !collapsed.value
}

const onSelcet = (key: string, item: MenuOption) => {
  //console.log(key, item)
  router.push({
    name: key
  })
}
</script>

<style lang="scss" scoped>
$siderHeight: 100vh;

@include go(project) {
  &-sider {
    @include fetch-bg-color('aside-background-color');
    &-top {
      display: flex;
      flex-flow: row !important;
      align-items: center;
      height: 64px;
      padding-left: 8px;
    }
    &-flex {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: $siderHeight;
      position: relative;

      &-top {
        height: $--header-height;
        @include fetch-bg-color('top-background');
      }

      &-content {
        position: absolute;
        top: 16px;
        left: 16px;
        border-radius: 18px;
        @include fetch-bg-color('side-background');
        backdrop-filter: blur(50px);
        height: calc(100vh - 32px);
      }
    }
  }
  &-layout-sider {
    height: $siderHeight;
  }
  .content-top {
    top: $--header-height;
    margin-top: 1px;
  }

  .collapsed-width {
    width: 64px;
  }

  .uncollapsed-width {
    width: 240px;
  }
}

:deep(.n-menu-item-content--selected)::before {
  background-image: #{$--color-dark-menu-title-select};
}

:deep(.n-menu-item-content) {
  padding-left: 16px !important;
}
</style>
