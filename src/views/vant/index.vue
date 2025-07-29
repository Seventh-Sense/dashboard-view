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
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div class="content-wrapper" :style="{ transform: `translateX(${offsetX}px)` }">
        <div v-for="(slide, index) in slides" :key="index" class="content-item">
          <PreviewList :ProjectData="slide" :ProjectNum="index" />
        </div>
      </div>
    </div>
    <FloatingIcon @click="handleFloatingIconClick" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { ref } from 'vue'
import { readProjectList } from '@/api/http'
import { PreviewList } from '../display/PreviewList'
import { FloatingIcon } from '../display/FloatingIcon'
import { useRouter } from 'vue-router'
import { PageEnum } from '@/enums/pageEnum'

const flag = ref(false)
const currentIndex = ref(0)
const slides = ref<any[]>([])

const offsetX = ref(0)
const startX = ref(0)
const isSwiping = ref(false)
const isAnimating = ref(false)

const router = useRouter()

onMounted(() => {
  initTabs()
})

const initTabs = async () => {
  flag.value = true

  try {
    const res: any = await readProjectList()

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      return
    }

    if (Array.isArray(res.data) && res.data.length > 0) {
      res.data.forEach((item: any) => {
        slides.value.push(item)
      })
    }
  } catch (e) {
    console.error('onChange:', e)
  } finally {
    flag.value = false
    console.log('Tabs initialized with data:', slides.value)
  }
}

const switchTab = (index: any) => {
  if (isAnimating.value) return

  currentIndex.value = index
  offsetX.value = -index * window.innerWidth
  console.log(window.innerWidth)
}

// 触摸开始
const onTouchStart = (e: TouchEvent) => {
  if (isAnimating.value) return

  isSwiping.value = true
  startX.value = e.touches[0].clientX
}

// 触摸移动
const onTouchMove = (e: TouchEvent) => {
  if (!isSwiping.value || isAnimating.value) return

  const currentX = e.touches[0].clientX
  const diffX = currentX - startX.value

  // 限制滑动范围
  if (
    (currentIndex.value === 0 && diffX > 0) ||
    (currentIndex.value === slides.value.length - 1 && diffX < 0)
  ) {
    return
  }

  offsetX.value = -currentIndex.value * window.innerWidth + diffX
}

// 触摸结束
const onTouchEnd = (e: TouchEvent) => {
  if (!isSwiping.value || isAnimating.value) return

  isSwiping.value = false
  const endX = e.changedTouches[0].clientX
  const diffX = endX - startX.value
  const threshold = window.innerWidth * 0.2

  let newIndex = currentIndex.value

  if (Math.abs(diffX) > threshold) {
    if (diffX > 0 && currentIndex.value > 0) {
      newIndex = currentIndex.value - 1
    } else if (diffX < 0 && currentIndex.value < slides.value.length - 1) {
      newIndex = currentIndex.value + 1
    }
  }

  // 平滑切换到新标签
  animateToIndex(newIndex)
}

// 动画切换到指定索引
const animateToIndex = (index: any) => {
  if (isAnimating.value) return

  isAnimating.value = true
  currentIndex.value = index

  // 使用requestAnimationFrame优化动画
  const targetOffset = -index * window.innerWidth
  const startOffset = offsetX.value
  const startTime = performance.now()
  const duration = 300

  const animate = (time: any) => {
    const elapsed = time - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeProgress = easeOutCubic(progress)

    offsetX.value = startOffset + (targetOffset - startOffset) * easeProgress

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      offsetX.value = targetOffset
      isAnimating.value = false
    }
  }

  requestAnimationFrame(animate)
}

// 缓动函数
const easeOutCubic = (t: any) => {
  return 1 - Math.pow(1 - t, 3)
}

const handleFloatingIconClick = () => {
  router.replace({
    path: PageEnum.BASE_HOME_ITEMS
  })
}
</script>

<style lang="scss" scoped>
.spin-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.tabs-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.tabs-bar {
  position: absolute;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  z-index: 100;
  background: rgba(0, 0, 0, 0.53);
  border-radius: 25px;
  height: 48px;
}

.tabs-item {
  height: 100%;
  padding: 12px 16px;
  font-size: 16px;
  line-height: 24px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.25s ease;
  text-align: center;
  white-space: nowrap;
}

.tabs-item.active {
  background: radial-gradient(149% 100% at 50% 100%, #00ced1 0%, #6666ff 100%);
  color: #ffffff;
  font-weight: bold;
}

.content-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.content-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  will-change: transform;
}

.content-item {
  flex: 0 0 100%;
  height: 100%;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}
</style>
