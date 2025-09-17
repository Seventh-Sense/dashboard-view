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
import { setLocalStorage, cryptoEncode } from '@/utils'
import { StorageEnum } from '@/enums/storageEnum'

// 常量设置
const { GO_LOGIN_INFO_STORE } = StorageEnum
const SWIPE_THRESHOLD = 50
const ANIMATION_DURATION = 300
const RENDER_RANGE = 1 // 渲染范围：当前页前后各1页
const EDGE_RESISTANCE = 0.2 // 边缘阻力系数，值越小阻力越大

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
const containerBgColor = ref('#fff') // 容器背景色

const router = useRouter()

const formInline = reactive({
  username: 'user',
  password: '123456'
})

// 计算属性：判断是否应该渲染某个页面
const shouldRender = computed(() => (index: number) => {
  if (slides.value.length <= 1) return true

  // 只渲染当前页和相邻页面
  return Math.abs(index - currentIndex.value) <= RENDER_RANGE
})

// 计算最后一页索引
const lastPageIndex = computed(() => slides.value.length - 1)

onMounted(() => {
  // 存储登录信息
  setLocalStorage(
    GO_LOGIN_INFO_STORE,
    cryptoEncode(
      JSON.stringify({
        username: formInline.username,
        password: formInline.password
      })
    )
  )

  // 初始化屏幕宽度
  screenWidth.value = window.innerWidth
  window.addEventListener('resize', handleResize)

  // 初始化数据
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

    // 过滤数据
    slides.value = res.data.filter(
      (item: any) => item.description === 'dashboard' && item.content !== '""'
    )

    // 预解析内容
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
  screenWidth.value = window.innerWidth
  offsetX.value = -currentIndex.value * screenWidth.value
}

// 切换标签
const switchTab = (index: number) => {
  if (isAnimating.value || currentIndex.value === index) return
  animateToIndex(index)
}

// 触摸开始
const onTouchStart = (e: TouchEvent) => {
  if (isAnimating.value || slides.value.length <= 1) return

  const touch = e.touches[0]
  startX.value = touch.clientX
  startY.value = touch.clientY
  isSwiping.value = true
  isHorizontal.value = null
}

// 触摸移动 - 增强第一页右滑边界限制
const onTouchMove = (e: TouchEvent) => {
  if (!isSwiping.value || isAnimating.value || slides.value.length <= 1) return

  const touch = e.touches[0]
  const diffX = touch.clientX - startX.value
  const diffY = touch.clientY - startY.value

  // 确定滑动方向
  if (isHorizontal.value === null) {
    isHorizontal.value = Math.abs(diffX) > Math.abs(diffY)
  }
  if (!isHorizontal.value) return

  // 计算基础偏移量
  let newOffset = -currentIndex.value * screenWidth.value + diffX

  // 严格的第一页右滑限制
  if (currentIndex.value === 0) {
    // 第一页不允许向右滑动超过自身边界（偏移量不能大于0）
    const maxRightOffset = 0
    newOffset = Math.min(newOffset, maxRightOffset)

    // 增加右滑边缘阻力效果
    if (diffX > 0) {
      const excess = newOffset - maxRightOffset
      if (excess > 0) {
        newOffset = maxRightOffset + excess * EDGE_RESISTANCE
      }
    }
  }
  // 最后一页左滑限制
  else if (currentIndex.value === lastPageIndex.value && diffX < 0) {
    // 最后一页向左滑动有阻力
    const maxLeftOffset = -lastPageIndex.value * screenWidth.value
    newOffset = Math.max(newOffset, maxLeftOffset)

    const excess = maxLeftOffset - newOffset
    if (excess > 0) {
      newOffset = maxLeftOffset + excess * EDGE_RESISTANCE
    }
  }

  // 应用计算后的偏移量
  offsetX.value = newOffset
}

// 触摸结束 - 确保边界限制
const onTouchEnd = (e: TouchEvent) => {
  if (!isSwiping.value || isAnimating.value || slides.value.length <= 1) return

  const touch = e.changedTouches[0]
  const diffX = touch.clientX - startX.value
  let newIndex = currentIndex.value

  // 严格限制第一页不能向右滑动到上一页
  if (currentIndex.value > 0) {
    // 非第一页可以正常向右滑动
    if (diffX > SWIPE_THRESHOLD) {
      newIndex = currentIndex.value - 1
    }
  }

  // 向左滑动逻辑（非最后一页）
  if (diffX < -SWIPE_THRESHOLD && currentIndex.value < lastPageIndex.value) {
    newIndex = currentIndex.value + 1
  }

  animateToIndex(newIndex)
  resetSwipeState()
}

// 触摸取消
const onTouchCancel = () => {
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
  if (isAnimating.value || index === currentIndex.value) return

  isAnimating.value = true
  currentIndex.value = index
  offsetX.value = -index * screenWidth.value

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
  touch-action: pan-y;
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
  background-color: v-bind(containerBgColor);
}

.content-wrapper {
  display: flex;
  height: 100%;
  will-change: transform;
}

.content-item {
  flex: 0 0 auto;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background-color: v-bind(containerBgColor);
}
</style>
