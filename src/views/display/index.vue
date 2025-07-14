<template>
  <swiper
    :modules="[Navigation, Pagination]"
    navigation
    pagination
    :slides-per-view="1"
    :space-between="50"
    @swiper="onSwiper"
    @slide-change="onSlideChange"
  >
    <!-- 幻灯片内容 -->
    <swiper-slide v-for="(slide, index) in slides" :key="index">
      <PreviewList :ProjectData="slide" :ProjectNum="index" />
    </swiper-slide>
  </swiper>
  <FloatingIcon @click="handleFloatingIconClick" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
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

onMounted(() => {
  initTable()
})

const initTable = async () => {
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
}
</style>
