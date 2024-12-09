<template>
  <div class="content">
    <div v-if="isShow" class="container">
      <div class="container-top">
        <span class="container-top-title">{{ $t('device.point_list') }}</span>
        <n-button class="container-top-button" @click="search">
          {{ $t('global.r_search') }}
        </n-button>
      </div>
      <div class="container-content">
        <n-grid :x-gap="20" :y-gap="20" cols="2 s:2 m:3 l:3 xl:6 xxl:6" responsive="screen">
          <n-grid-item v-for="(item, index) in data" :key="index">
            <div class="container-content-card">
              <div class="container-content-card-top" @click="onClick(item)">
                <img width="96" height="96" :src="SVG_ICON.card_icons.deviceA" />
              </div>
              <div class="container-content-card-bottom">
                <span>{{ item.name }}</span>
                <img
                  width="24"
                  height="24"
                  :src="SVG_ICON.card_icons.file"
                  style="cursor: pointer"
                  @click="onOpen(item)"
                />
              </div>
            </div>
          </n-grid-item>
        </n-grid>
      </div>
    </div>
    <ParamList v-else :data="selectData" @show="onShow"/>
    <DeviceInfo v-model:showModal="showModal" :device="selectDevice"/>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SVG_ICON from '@/svg/SVG_ICON'
import { ParamList } from './components/ParamList'
import { DeviceInfo } from './components/DeviceInfo'

const isShow = ref<boolean>(true)
const selectData = ref({})

const showModal = ref<boolean>(false)
const selectDevice = ref({})


const data: any = ref([])
const search = () => {}

onMounted(() => {
  for (var i = 0; i < 100; i++) {
    data.value.push({
      id: i + 1,
      name: `测试点位${i + 1}`,
      location: `测试点位${i + 1}位置`,
      status: (i % 2) + 1,
      createdAt: '2022-06-01 10:00:00',
      updatedAt: '2022-06-01 10:00:00'
    })
  }
})



const onClick = (data: any) => {
  selectData.value = data
  isShow.value = false
}

const onShow = (data: boolean) => {
  isShow.value = data
}

const onOpen = (data: any) => {
  selectDevice.value = data
  showModal.value = true
}
</script>

<style lang="scss" scoped>
.content {
  height: calc(100vh - #{$--header-height});
  padding: 16px;
}

.container {
  background-color: #{$--color-dark-side};
  border-radius: 18px;
  backdrop-filter: blur(50px);
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;

  &-top {
    height: #{$--card-top-height};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;

    &-title {
      font-size: 16px;
      font-weight: bold;
      color: #ffffffed;
      font-style: normal;
      text-transform: none;
    }

    &-button {
      width: 64px;
      height: 32px;
      border-radius: 2px;
      font-size: 14px;
    }
  }

  &-content {
    padding: 0 16px;
    flex: 1;
    overflow-y: auto;

    &-card {
      height: 166px;
      width: 100%;
      border-radius: 8px;
      background-color: $--color-dark-b-card;

      &-top {
        height: 122px;
        width: 100%;
        border-radius: 8px;
        background-color: $--color-dark-card-image;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }

      &-bottom {
        width: 100%;
        height: 44px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 8px;
      }
    }
  }
}
</style>
