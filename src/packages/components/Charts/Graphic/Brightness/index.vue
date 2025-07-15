<template>
  <TouchSlider
    v-model="value"
    :height="30"
    :thumb-size="32"
    :show-percent="true"
    bar-color="#4facfe"
    thumb-color="#fff"
    track-color="rgba(255, 255, 255, 0.2)"
  />
</template>

<script setup lang="ts">
import TouchSlider from './TouchSlider.vue'
import { PropType, watch, toRefs, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { parseData } from '@/utils'


const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})


const flag = ref(false)
const t = window['$t']
const value = ref<any>(50)
</script>

<style lang="scss" scoped></style>
