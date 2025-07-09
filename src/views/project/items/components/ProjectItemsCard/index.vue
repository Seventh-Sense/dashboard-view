<template>
  <div v-if="cardData" class="go-items-list-card">
    <div class="list-content">
      <div class="list-content-title">
        <div class="list-content-title-top">
          <div class="list-content-title-avatar"></div>
          <span style="color: rgba(255, 255, 255, 0.93); font-size: 12px; line-height: 17px">
            admin
          </span>
        </div>
        <img width="24" height="24" :src="SVG_ICON.card_icons.template" @click="previewHandle()" />
      </div>
      <div class="list-content-desc">
        <img width="112" height="112" :src="SVG_ICON.card_icons.picture" />
      </div>
    </div>

    <n-space justify="space-between" align="center" class="list-footer" :wrap="false">
      <div style="display: flex; flex-direction: column; justify-content: center">
        <span style="color: rgba(255, 255, 255, 1); font-size: 14px">
          {{ cardData.title }}
        </span>
        <span class="list-footer-title">{{ formatTime(cardData.time) }}</span>
      </div>

      <n-space v-if="isShow" size="large" justify="end" align="center" :wrap="false">
        <img
          width="24"
          height="24"
          :src="SVG_ICON.card_icons.edit"
          @click="editHandle()"
          style="cursor: pointer"
        />
        <img
          width="24"
          height="24"
          :src="SVG_ICON.card_icons.delete_one"
          @click="deleteHanlde()"
          style="cursor: pointer"
        />
      </n-space>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue'

import { Chartype } from '../../index.d'

import SVG_ICON from '@/svg/SVG_ICON'
import { getLoginUser } from '@/utils'

const emit = defineEmits(['delete', 'resize', 'edit', 'preview'])

const props = defineProps({
  cardData: Object as PropType<Chartype>
})

const isShow = ref(false)

onMounted(() => {
  isShow.value = getLoginUser()
})
const formatTime = (data: string) => {
  //2024-08-19T00:56:22.141127
  let localZone = new Date().getTimezoneOffset() / -60
  
  let localTime = new Date(data).getTime()
  
  return new Date(localTime).toLocaleString()
}
// 删除处理
const deleteHanlde = () => {
  emit('delete', props.cardData)
}

// 编辑处理
const editHandle = () => {
  emit('edit', props.cardData)
}

//预览处理
const previewHandle = () => {
  emit('preview', props.cardData)
}
</script>

<style lang="scss" scoped>
$contentHeight: 180px;
$cardHeight: 185px;
$cardContentHeight: 133px;
$cardTopHeight: 44px;

@include go('items-list-card') {
  position: relative;
  border-radius: $--border-radius-base;
  border: 0;
  background: $--color-dark-card;
  height: $cardHeight;

  .list-content {
    cursor: pointer;
    border-radius: $--border-radius-base;
    height: $cardContentHeight;
    background: $--color-dark-card-image;

    &-title {
      padding: 0 10px;
      width: 100%;
      height: $cardTopHeight;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &-avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: linear-gradient(227deg, #6666ff 0%, #00ced1 100%);
        margin-right: 8px;
      }

      &-top {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
    }

    &-desc {
      height: $cardContentHeight - $cardTopHeight;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .list-footer {
    height: $cardHeight - $cardContentHeight;
    padding: 0 16px;

    &-title {
      width: 100%;
      font-size: 12px;
      font-weight: 400;
      font-style: normal;
      color: $--color-dark-card-font;
      overflow: hidden; /* 确保超出容器的文本被隐藏 */
      white-space: nowrap; /* 防止文本换行 */
      text-overflow: ellipsis;
    }

    &-icon {
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
  }
}
</style>
