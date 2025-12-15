<template>
  <div v-if="flag" class="spin-page">
    <n-spin size="small" />
  </div>
  <div v-else class="tabs-container">
    <div class="tabs-bar">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="tabs-item"
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
      @touchend="onTouchEnd"
      @touchcancel="onTouchCancel"
    >
      <div
        class="content-wrapper"
        :style="{
          transform: `translateX(${offsetX}px)`,
          transition: isAnimating ? 'transform 0.3s ease-out' : 'none'
        }"
      >
        <!-- 只渲染当前页和相邻页面 -->
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="content-item"
          :style="{ width: `${screenWidth}px` }"
        >
          <PreviewList
            :ProjectData="slide"
            :ProjectNum="index"
            :key="`preview-${index}`"
            v-if="shouldRender(index)"
          />
        </div>
      </div>
    </div>

    <FloatingIcon @click="handleFloatingIconClick" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { readProjectList } from '@/api/http'
import { PreviewList } from '../display/PreviewList'
import { FloatingIcon } from '../display/FloatingIcon'
import { useRouter } from 'vue-router'
import { PageEnum } from '@/enums/pageEnum'
import { setLocalStorage, cryptoEncode, routerTurnByName } from '@/utils'
import { StorageEnum } from '@/enums/storageEnum'

// 常量设置
const { GO_LOGIN_INFO_STORE } = StorageEnum
const SWIPE_THRESHOLD = 50
const ANIMATION_DURATION = 300
const RENDER_RANGE = 1
const EDGE_RESISTANCE = 0.05 // 进一步降低边缘阻力

// 状态管理
const flag = ref(false)
const currentIndex = ref(0)
const slides = ref<any[]>([])
const offsetX = ref(0)
const startX = ref(0)
const startY = ref(0)
const isSwiping = ref(false)
const isAnimating = ref(false)
const isHorizontal = ref<boolean | null>(null)
const screenWidth = ref(window.innerWidth)
const containerBgColor = ref('#fff')

const router = useRouter()

const enableSwipe = ref(true) // 默认启用滑动功能

const formInline = reactive({
  username: 'user',
  password: '123456'
})

// 计算属性：判断是否应该渲染某个页面
const shouldRender = computed(() => (index: number) => {
  if (slides.value.length <= 1) return true
  return Math.abs(index - currentIndex.value) <= RENDER_RANGE
})

// 计算最后一页索引
const lastPageIndex = computed(() => Math.max(0, slides.value.length - 1))

// 检查是否在边界
const isAtFirstPage = computed(() => currentIndex.value === 0)
const isAtLastPage = computed(() => currentIndex.value === lastPageIndex.value)

onMounted(() => {
  setLocalStorage(
    GO_LOGIN_INFO_STORE,
    cryptoEncode(
      JSON.stringify({
        username: formInline.username,
        password: formInline.password
      })
    )
  )

  screenWidth.value = window.innerWidth
  window.addEventListener('resize', handleResize)
  initTabs()

  return () => {
    window.removeEventListener('resize', handleResize)
  }
})

// 初始化标签数据
const initTabs = async () => {
  flag.value = true
  try {
    const res: any = await readProjectList()
    if (res.status !== 'OK') return

    

    slides.value = res.data.filter(
      (item: any) => item.description === 'dashboard' && item.content !== '""'
    )

    if (slides.value.length === 0) {
      routerTurnByName(PageEnum.BASE_LOGIN_NAME, true)
      return
    }

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

// 窗口大小变化处理
const handleResize = () => {
  if (isSwiping.value || isAnimating.value) return
  const oldWidth = screenWidth.value
  screenWidth.value = window.innerWidth

  // 重新计算偏移量，保持当前页面位置
  if (oldWidth !== screenWidth.value) {
    offsetX.value = -currentIndex.value * screenWidth.value
  }
}

// 切换标签
const switchTab = (index: number) => {
  if (isAnimating.value || currentIndex.value === index) return
  animateToIndex(index)
}

// 触摸开始
const onTouchStart = (e: TouchEvent) => {
  // 检查是否启用滑动功能
  if (!enableSwipe.value) return

  if (isAnimating.value || slides.value.length <= 1) return

  const touch = e.touches[0]
  startX.value = touch.clientX
  startY.value = touch.clientY
  isSwiping.value = true
  isHorizontal.value = null
}

// 触摸移动 - 完全禁止边界滑动
const onTouchMove = (e: TouchEvent) => {
  // 检查是否启用滑动功能
  if (!enableSwipe.value) return

  if (!isSwiping.value || isAnimating.value || slides.value.length <= 1) return

  const touch = e.touches[0]
  const diffX = touch.clientX - startX.value
  const diffY = touch.clientY - startY.value

  // 确定滑动方向
  if (isHorizontal.value === null) {
    const isHorizontalMove = Math.abs(diffX) > Math.abs(diffY)
    const moveThreshold = 10 // 最小移动阈值

    if (Math.abs(diffX) > moveThreshold || Math.abs(diffY) > moveThreshold) {
      isHorizontal.value = isHorizontalMove
    }
  }

  if (!isHorizontal.value) return

  // 阻止默认行为，防止页面滚动
  e.preventDefault()

  const isSwipingRight = diffX > 0 // 向右滑动（显示上一页）
  const isSwipingLeft = diffX < 0 // 向左滑动（显示下一页）

  // 严格的边界检查
  if (isAtFirstPage.value && isSwipingRight) {
    // 第一页禁止右滑，只允许极小的视觉反馈
    const maxMove = 5
    const resistanceMove = Math.min(diffX * EDGE_RESISTANCE, maxMove)
    offsetX.value = -currentIndex.value * screenWidth.value + resistanceMove
    return
  }

  if (isAtLastPage.value && isSwipingLeft) {
    // 最后一页禁止左滑，只允许极小的视觉反馈
    const maxMove = -5
    const resistanceMove = Math.max(diffX * EDGE_RESISTANCE, maxMove)
    offsetX.value = -currentIndex.value * screenWidth.value + resistanceMove
    return
  }

  // 正常情况下的滑动
  offsetX.value = -currentIndex.value * screenWidth.value + diffX
}

// 触摸结束 - 确保严格的边界检查
const onTouchEnd = (e: TouchEvent) => {
  // 检查是否启用滑动功能
  if (!enableSwipe.value) return

  if (!isSwiping.value || isAnimating.value || slides.value.length <= 1) return

  const touch = e.changedTouches[0]
  const diffX = touch.clientX - startX.value
  const absDiffX = Math.abs(diffX)

  let newIndex = currentIndex.value

  // 只有在水平滑动时才处理切换逻辑
  if (isHorizontal.value && absDiffX > SWIPE_THRESHOLD) {
    const isSwipingRight = diffX > 0
    const isSwipingLeft = diffX < 0

    // 严格的边界检查
    if (isSwipingRight && !isAtFirstPage.value) {
      // 向右滑动且不在第一页，切换到上一页
      newIndex = currentIndex.value - 1
    } else if (isSwipingLeft && !isAtLastPage.value) {
      // 向左滑动且不在最后一页，切换到下一页
      newIndex = currentIndex.value + 1
    }
    // 在边界情况下，newIndex 保持为 currentIndex.value，不会切换
  }

  animateToIndex(newIndex)
  resetSwipeState()
}

// 触摸取消
const onTouchCancel = () => {
  // 检查是否启用滑动功能
  if (!enableSwipe.value) return

  if (isSwiping.value && !isAnimating.value) {
    animateToIndex(currentIndex.value)
    resetSwipeState()
  }
}

// 重置滑动状态
const resetSwipeState = () => {
  isSwiping.value = false
  isHorizontal.value = null
}

// 动画切换到指定索引
const animateToIndex = (index: number) => {
  if (isAnimating.value) return

  // 确保索引在有效范围内
  const validIndex = Math.max(0, Math.min(index, lastPageIndex.value))

  isAnimating.value = true
  currentIndex.value = validIndex
  offsetX.value = -validIndex * screenWidth.value

  setTimeout(() => {
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
  touch-action: none; /* 完全禁用默认触摸行为 */
  background-color: v-bind(containerBgColor);
}

.tabs-bar {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  z-index: 100;
  background: rgba(0, 0, 0, 0.53);
  border-radius: 16px;
  height: 48px;
  padding: 0 8px;
  overflow-x: auto;
  overflow-y: hidden;
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
  touch-action: none; /* 禁用默认触摸行为 */
  background-color: v-bind(containerBgColor);
}

.content-wrapper {
  display: flex;
  height: 100%;
  width: fit-content; /* 确保宽度正确 */
  will-change: transform;
}

.content-item {
  flex: 0 0 auto;
  height: 100%;
  overflow: hidden; /* 临时禁用滚动，避免冲突 */
  position: relative;
  background-color: v-bind(containerBgColor);
}

/* 为 PreviewList 组件提供独立的滚动容器 */
.content-item :deep(.preview-list-container) {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y; /* 只允许垂直滚动 */
}
</style>
