<template>
  <div
    v-if="flag"
    style="display: flex; align-items: center; justify-content: center; height: 100vh"
  >
    <n-spin size="small" />
  </div>
  <div v-else>
    <swiper
      :modules="[Navigation, Pagination, Virtual]"
      :navigation="{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }"
      :noSwipingSelector="'.slider-container'"
      pagination
      :loop="canLoop"
      :slides-per-view="slidesPerView"
      :free-mode="{ enabled: false }"
      :resistance-ratio="0"
      :follow-finger="true"
      :threshold="10"
      :speed="500"
      :space-between="0"
      :touch="{
        touchRatio: 0.8,
        touchStartPreventDefault: false,
        touchMoveStopPropagation: true
      }"
      virtual
      @swiper="onSwiper"
      @slide-change="onSlideChange"
    >
      <!-- 幻灯片内容 -->
      <swiper-slide
        v-for="(slide, index) in slides"
        :key="index"
        :virtualIndex="index"
        @touchstart.stop
      >
        <PreviewList :ProjectData="slide" :ProjectNum="index" />
      </swiper-slide>
    </swiper>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
    <FloatingIcon @click="handleFloatingIconClick" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Virtual } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { readProjectList } from '@/api/http'
import { PreviewList } from './PreviewList'
import { FloatingIcon } from './FloatingIcon'
import { useRouter } from 'vue-router'
import { PageEnum } from '@/enums/pageEnum'

const router = useRouter()
const slides = ref<any[]>([])
const flag = ref(false)

const slidesPerView = 1

const canLoop = computed(() => slides.value.length >= slidesPerView * 2)

onMounted(() => {
  initTable()
})

const initTable = async () => {
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
  }
}

const onSwiper = (swiper: any) => {
  //console.log('Swiper实例:', swiper)
}

const onSlideChange = () => {
  //console.log('幻灯片切换')
}

const handleFloatingIconClick = () => {
  router.replace({
    path: PageEnum.BASE_HOME_ITEMS
  })
}
</script>

<style lang="scss" scoped>
.swiper {
  height: 100vh;
  width: 100%;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.swiper-slide {
  transform: translateZ(0);
  will-change: transform;
}

.swiper-slide * {
  touch-action: pan-y;
}

.swiper-button-prev,
.swiper-button-next {
  width: 70px !important; /* 增大宽度 */
  height: 70px !important; /* 增大高度 */
  background-size: 30px 30px !important; /* 调整图标大小 */
  background-color: rgba(0, 0, 0, 0.2); /* 可选：添加背景 */
  border-radius: 50%; /* 可选：圆形按钮 */
}

/* 单独调整左右按钮位置 */
.swiper-button-prev {
  left: 10px !important;
}
.swiper-button-next {
  right: 10px !important;
}
</style>
