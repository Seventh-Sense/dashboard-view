<template>
  <n-dropdown trigger="hover" @select="handleSelect" :show-arrow="true" :options="isShow ? options: option">
    <div class="user-info-box">
      <person-icon v-if="fallback"></person-icon>
      <n-avatar
        v-if="!fallback"
        round
        object-fit="cover"
        size="medium"
        :src="Person"
        @error="errorHandle"
      ></n-avatar>
    </div>
  </n-dropdown>

  <!-- 系统设置 model -->
  <go-system-set v-model:modelShow="modelShow"></go-system-set>
  <!-- 关于软件 model -->
  <!-- <go-system-info v-model:modelShow="modelShowInfo"></go-system-info> -->
  <VersionModal v-model:showModal="modelShowInfo" />
  <GoJob v-if="jobShow" v-model:isShowModal="jobShow"/>
</template>

<script lang="ts" setup>
import { h, onMounted, ref } from 'vue'
import { NAvatar, NText } from 'naive-ui'
import { renderIcon } from '@/utils'
import { logout, renderLang, getLoginUser } from '@/utils'
import { GoSystemSet } from '@/components/GoSystemSet/index'
import { GoSystemInfo } from '@/components/GoSystemInfo/index'
import Person from './person.png'

import { icon } from '@/plugins'
import { VersionModal } from '@/views/login/modal/VersionModal'
import { GoJob } from '@/components/GoJob/index'
const { ChatboxEllipsesIcon, PersonIcon, LogOutOutlineIcon, TvOutlineIcon } = icon.ionicons5

const t = window['$t']

const modelShowInfo = ref(false)
const modelShow = ref(false)
const jobShow = ref(false)

// 是否失败
const fallback = ref(false)
const isShow = ref(false)

// 用户图标渲染
const renderUserInfo = () => {
  return h(
    'div',
    {
      style: 'display: flex; align-items: center; padding: 8px 12px;'
    },
    [
      h(NAvatar, {
        round: true,
        style: 'margin-right: 12px;',
        src: Person
      }),
      h('div', null, [h('div', null, [h(NText, { depth: 2 }, { default: () => isShow.value ? 'admin' : 'User' })])])
    ]
  )
}

const option = ref([
  {
    label: '我的信息',
    key: 'info',
    type: 'render',
    render: renderUserInfo
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: renderLang('global.logout'),
    key: 'logout',
    icon: renderIcon(LogOutOutlineIcon)
  }
])
const options = ref([
  {
    label: '我的信息',
    key: 'info',
    type: 'render',
    render: renderUserInfo
  },
  {
    type: 'divider',
    key: 'd1'
  },
  // {
  //   label: renderLang('global.sys_set'),
  //   key: 'sysSet',
  //   icon: renderIcon(SettingsSharpIcon)
  // },
  {
    label: renderLang('project.task'),
    key: 'job',
    icon: renderIcon(TvOutlineIcon)
  },
  {
    label: renderLang('global.contact'),
    key: 'contact',
    icon: renderIcon(ChatboxEllipsesIcon)
  },
  {
    type: 'divider',
    key: 'd3'
  },
  {
    label: renderLang('global.logout'),
    key: 'logout',
    icon: renderIcon(LogOutOutlineIcon)
  }
])



onMounted(() => {
  // 获取登录用户信息
  isShow.value = getLoginUser()
})

// 图片渲染错误
const errorHandle = (e: Event) => {
  fallback.value = true
}

// 系统设置
const sysSetHandle = () => {
  modelShow.value = true
}

const sysInfoHandle = () => {
  modelShowInfo.value = true
}

const openJob = () => {
  jobShow.value = true
}

const handleSelect = (key: string) => {
  switch (key) {
    case 'contact':
      sysInfoHandle()
      break
    case 'sysSet':
      sysSetHandle()
      break
    case 'job':
      openJob()
      break
    case 'logout':
      logout()
      break
  }
}
</script>

<style lang="scss" scoped>
.user-info-box {
  cursor: pointer;
  transform: scale(0.7);
}
</style>
