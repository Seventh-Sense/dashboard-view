<template>
  <div v-if="flag" class="spin-page">
    <n-spin size="small" />
  </div>
  <div v-else class="tabs-container">
    <div
      class="tabs-bar"
      :style="{
        backgroundColor: is_dark ? 'rgba(0, 0, 0, 0.53)' : 'rgba(255, 255, 255, 1)'
      }"
    >
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="tabs-item"
        :style="{
          color:
            currentIndex === index
              ? 'rgba(255, 255, 255, 1)'
              : is_dark
              ? 'rgba(255, 255, 255, 1)'
              : 'rgba(0, 0, 0, 0.53)'
        }"
        :class="{ active: currentIndex === index }"
        @click="switchTab(index)"
      >
        {{ slide.name }}
      </div>
    </div>

    <div
      class="content-container"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend.passive="onTouchEnd"
      @touchcancel.passive="onTouchCancel"
    >
      <div
        class="content-wrapper"
        :style="{
          transform: `translateX(${offsetX}px)`,
          transition: isAnimating ? 'transform 0.3s ease-out' : 'none'
        }"
      >
        <div
          v-for="(slide, index) in slides"
          :key="index"
          v-memo="[currentIndex, index]"
          class="content-item"
          :style="{ width: `${screenWidth}px` }"
        >
          <suspense v-if="slide.description === 'dashboard'">
            <PreviewList
              :ProjectData="slide"
              :ProjectNum="index"
              :key="`preview-${index}`"
              v-if="shouldRender(index)"
            />
          </suspense>
          <suspense v-else-if="slide.description === 'graphic'">
            <GraphicSingle
              :ProjectData="slide.parsedContent"
              :key="`preview-${index}`"
              v-if="shouldRender(index)"
            />
          </suspense>
        </div>
      </div>
    </div>

    <FloatingIcon @click="handleFloatingIconClick" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { PreviewList } from '../display/PreviewList'
import { FloatingIcon } from '../display/FloatingIcon'
import { useRouter } from 'vue-router'
import { PageEnum } from '@/enums/pageEnum'
import {
  setLocalStorage,
  cryptoEncode,
  routerTurnByName,
  getLocalStorage,
  getLoginInfo
} from '@/utils'
import { StorageEnum } from '@/enums/storageEnum'
import localforage from '@/utils/localforage'
import { GraphicSingle } from '@/page/GraphicPreview/GraphicSingle'

// 常量设置
const { GO_LOGIN_INFO_STORE } = StorageEnum
const SWIPE_THRESHOLD = 50
const ANIMATION_DURATION = 300
const RENDER_RANGE = 1
const EDGE_RESISTANCE = 0.05

// 状态管理
const flag = ref(false)
const currentIndex = ref(0)
const slides = ref<any[]>([])
const offsetX = ref(0)
const isAnimating = ref(false)

// 滑动临时状态
let startX = 0
let startY = 0
let isSwiping = false
let isHorizontal: boolean | null = null

const screenWidth = ref(window.innerWidth)
const containerBgColor = ref('#fff')
const router = useRouter()
const enableSwipe = ref(true)
const limit = ref(5)
const is_dark = ref(true)

const formInline = reactive({
  username: 'user',
  password: '123456'
})

// 计算属性
const shouldRender = computed(() => (index: number) => {
  if (slides.value.length <= 5) return true
  return Math.abs(index - currentIndex.value) <= RENDER_RANGE
})

const lastPageIndex = computed(() => Math.max(0, slides.value.length - 1))
const isAtFirstPage = computed(() => currentIndex.value === 0)
const isAtLastPage = computed(() => currentIndex.value === lastPageIndex.value)

// 防抖 resize
let resizeTimer: number | null = null
const handleResize = () => {
  if (resizeTimer) window.clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(() => {
    if (isSwiping || isAnimating.value) return
    screenWidth.value = window.innerWidth
    offsetX.value = -currentIndex.value * screenWidth.value
  }, 100)
}

onMounted(() => {
  loadLogoInfo()
  loadConfig()
  screenWidth.value = window.innerWidth
  window.addEventListener('resize', handleResize)
  initTabs()

  return () => {
    window.removeEventListener('resize', handleResize)
    if (resizeTimer) window.clearTimeout(resizeTimer)
  }
})

const loadLogoInfo = () => {
  let info = getLoginInfo()
  if (info !== null) {
    setLocalStorage(GO_LOGIN_INFO_STORE, cryptoEncode(info))
  } else {
    setLocalStorage(
      GO_LOGIN_INFO_STORE,
      cryptoEncode(
        JSON.stringify({
          username: formInline.username,
          password: formInline.password
        })
      )
    )
  }
}

const loadConfig = () => {
  try {
    let config = getLocalStorage('SettingData')
    if (
      config !== null &&
      config !== undefined &&
      typeof config === 'object' &&
      !Array.isArray(config)
    ) {
      if (config.limit !== undefined) limit.value = config.limit
      if (config.enableSwipe !== undefined) enableSwipe.value = config.enableSwipe
      if (config.isDark !== undefined) is_dark.value = config.isDark
    }
  } catch (error) {
    console.error('加载配置出错:', error)
  }
}

// 初始化
const initTabs = async () => {
  flag.value = false
  try {
    const list: any = await localforage.getItem('ProjectList')
    if (list.length === 0) {
      routerTurnByName(PageEnum.BASE_LOGIN_NAME, true)
      return
    }
    slides.value = list.filter((item: any) => item.content !== '""')
    slides.value = slides.value.slice(0, limit.value)
    slides.value.forEach(item => {
      try {
        item.parsedContent = JSON.parse(item.content)
      } catch {
        item.parsedContent = {}
      }
    })
  } catch (e) {
    console.error('初始化失败:', e)
  } finally {
    flag.value = false
  }
}

// 切换 tab
const switchTab = (index: number) => {
  if (isAnimating.value || currentIndex.value === index) return
  animateToIndex(index)
}

// 触摸
const onTouchStart = (e: TouchEvent) => {
  if (!enableSwipe.value) return
  if (isAnimating.value || slides.value.length <= 1) return

  const touch = e.touches[0]
  startX = touch.clientX
  startY = touch.clientY
  isSwiping = true
  isHorizontal = null
}

const onTouchMove = (e: TouchEvent) => {
  if (!enableSwipe.value || !isSwiping || isAnimating.value || slides.value.length <= 1) return

  const touch = e.touches[0]
  const diffX = touch.clientX - startX
  const diffY = touch.clientY - startY

  if (isHorizontal === null) {
    const isHorizontalMove = Math.abs(diffX) > Math.abs(diffY)
    const moveThreshold = 10
    if (Math.abs(diffX) > moveThreshold || Math.abs(diffY) > moveThreshold) {
      isHorizontal = isHorizontalMove
    }
  }

  if (!isHorizontal) return

  const isSwipingRight = diffX > 0
  const isSwipingLeft = diffX < 0

  if (isAtFirstPage.value && isSwipingRight) {
    const maxMove = 5
    const resistanceMove = Math.min(diffX * EDGE_RESISTANCE, maxMove)
    offsetX.value = -currentIndex.value * screenWidth.value + resistanceMove
    return
  }

  if (isAtLastPage.value && isSwipingLeft) {
    const maxMove = -5
    const resistanceMove = Math.max(diffX * EDGE_RESISTANCE, maxMove)
    offsetX.value = -currentIndex.value * screenWidth.value + resistanceMove
    return
  }

  offsetX.value = -currentIndex.value * screenWidth.value + diffX
}

const onTouchEnd = () => {
  if (!enableSwipe.value || !isSwiping || isAnimating.value || slides.value.length <= 1) return

  const diffX = offsetX.value + currentIndex.value * screenWidth.value
  const absDiffX = Math.abs(diffX)
  let newIndex = currentIndex.value

  if (isHorizontal && absDiffX > SWIPE_THRESHOLD) {
    const isSwipingRight = diffX > 0
    const isSwipingLeft = diffX < 0

    if (isSwipingRight && !isAtFirstPage.value) {
      newIndex = currentIndex.value - 1
    } else if (isSwipingLeft && !isAtLastPage.value) {
      newIndex = currentIndex.value + 1
    }
  }

  animateToIndex(newIndex)
  resetSwipeState()
}

const onTouchCancel = () => {
  if (!enableSwipe.value) return
  if (isSwiping && !isAnimating.value) {
    animateToIndex(currentIndex.value)
    resetSwipeState()
  }
}

const resetSwipeState = () => {
  isSwiping = false
  isHorizontal = null
}

// 动画
let animateTimer: number | null = null
const animateToIndex = (index: number) => {
  if (isAnimating.value) return
  const validIndex = Math.max(0, Math.min(index, lastPageIndex.value))

  isAnimating.value = true
  currentIndex.value = validIndex
  offsetX.value = -validIndex * screenWidth.value

  if (animateTimer) window.clearTimeout(animateTimer)
  animateTimer = window.setTimeout(() => {
    isAnimating.value = false
  }, ANIMATION_DURATION)
}

const handleFloatingIconClick = () => {
  router.replace({ path: PageEnum.BASE_HOME_ITEMS })
}
</script>

<style lang="scss" scoped>
.spin-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #fff;
}

.tabs-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: v-bind(containerBgColor);
  touch-action: pan-y;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.tabs-bar {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  z-index: 100;
  border-radius: 16px;
  height: 48px;
  padding: 0 0px;
  overflow-x: auto;
  overflow-y: hidden;
  will-change: transform;
  backface-visibility: hidden;
}

.tabs-bar::-webkit-scrollbar {
  display: none;
}

.tabs-item {
  padding: 12px 16px;
  font-size: 16px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  border-radius: 16px;
  white-space: nowrap;
  user-select: none;
  transition: all 0.2s ease;
  will-change: background, color;
}

.tabs-item.active {
  background: radial-gradient(149% 100% at 50% 100%, #00ced1 0%, #6666ff 100%);
  color: #ffffff;
}

.content-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: v-bind(containerBgColor);
  touch-action: none;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.content-wrapper {
  display: flex;
  height: 100%;
  width: fit-content;
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.content-item {
  flex: 0 0 auto;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: v-bind(containerBgColor);
  backface-visibility: hidden;
  transform: translateZ(0);
}

.content-item :deep(.preview-list-container) {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}
</style>