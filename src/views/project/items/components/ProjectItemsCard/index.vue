<template>
  <div v-if="cardData" class="go-items-list-card">
    <div class="list-content">
      <div class="list-content-title">
        <n-space align="center">
          <div class="list-content-title-avatar"></div>
          <div class="list-content-title-top">
            <span style="color: rgba(255, 255, 255, 1); font-size: 14px; line-height: 20px">
              {{ cardData.title }}
            </span>
            <span style="color: rgba(255, 255, 255, 0.6); font-size: 12px; line-height: 17px">
              admin
            </span>
          </div>
        </n-space>
      </div>
      <div class="list-content-desc">This is a project</div>
    </div>

    <n-space justify="space-between" align="center" class="list-footer" :wrap="false">
      <span class="list-footer-title">2024/4/23 11:23:23</span>

      <n-space size="large" :wrap="false">
        <n-tooltip v-for="item in selectOptions" placement="bottom" trigger="hover">
          <template #trigger>
            <component
              :is="item.icon"
              class="list-footer-icon"
              @click="handleSelect(item.key)"
            ></component>
          </template>
          <component :is="item.label"></component>
        </n-tooltip>
      </n-space>
      <!-- <n-dropdown
          trigger="hover"
          placement="bottom"
          :options="selectOptions"
          :show-arrow="true"
          @select="handleSelect"
        >
          <n-icon size="20" :depth="1">
            <EllipsisVerticalIcon />
          </n-icon>
        </n-dropdown> -->
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, PropType } from 'vue'
import { renderIcon, renderLang, requireErrorImg } from '@/utils'
import { icon } from '@/plugins'
import { MacOsControlBtn } from '@/components/Tips/MacOsControlBtn'
import { Chartype } from '../../index.d'
import { log } from 'console'

const {
  EllipsisVerticalIcon,
  CopyIcon,
  TrashIcon,
  PencilIcon,
  DownloadIcon,
  BrowsersOutlineIcon,
  HammerIcon,
  SendIcon
} = icon.ionicons5

const emit = defineEmits(['delete', 'resize', 'edit', 'preview'])

const props = defineProps({
  cardData: Object as PropType<Chartype>
})

// 处理url获取
const requireUrl = (name: string) => {
  return new URL(`../../../../../assets/images/${name}`, import.meta.url).href
}

const selectOptions = ref([
  {
    label: renderLang('global.r_edit'),
    key: 'edit',
    icon: renderIcon(HammerIcon)
  },
  {
    label: renderLang('global.r_preview'),
    key: 'preview',
    icon: renderIcon(BrowsersOutlineIcon)
  },
  {
    label: renderLang('global.r_delete'),
    key: 'delete',
    icon: renderIcon(TrashIcon)
  }
])

const handleSelect = (key: string) => {
  switch (key) {
    case 'preview':
      previewHandle()
      break
    case 'delete':
      deleteHanlde()
      break
    case 'edit':
      editHandle()
      break
  }
}

// 删除处理
const deleteHanlde = () => {
  emit('delete', props.cardData)
}

// 编辑处理
const editHandle = () => {
  emit('edit', props.cardData)
}

// 放大处理
const resizeHandle = () => {
  emit('resize', props.cardData)
}

//预览处理
const previewHandle = () => {
  emit('preview', props.cardData)
}
</script>

<style lang="scss" scoped>
$contentHeight: 180px;
$cardHeight: 200px;
$cardContentHeight: 160px;
$cardTopHeight: 52px;

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
      height: $cardTopHeight;
      display: flex;
      align-items: center;

      &-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(227deg, #6666ff 0%, #00ced1 100%);
      }

      &-top {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }

    &-desc {
      height: $cardContentHeight - $cardTopHeight;
      padding: 17px 6px;
    }
  }
  .list-footer {
    height: $cardHeight - $cardContentHeight;
    padding: 0 16px;
    

    &-title {
      width: 100%;
      font-size: 14px;
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
