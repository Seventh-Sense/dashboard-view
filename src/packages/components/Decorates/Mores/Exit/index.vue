<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 512 512"
    @click="clickExit"
  >
    <path
      d="M320 176v-40a40 40 0 0 0-40-40H88a40 40 0 0 0-40 40v240a40 40 0 0 0 40 40h192a40 40 0 0 0 40-40v-40"
      fill="none"
      :stroke="color"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="32"
    ></path>
    <path
      fill="none"
      :stroke="color"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="32"
      d="M384 176l80 80l-80 80"
    ></path>
    <path
      fill="none"
      :stroke="color"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="32"
      d="M191 256h273"
    ></path>
  </svg>
</template>

<script setup lang="ts">
import { PropType, toRefs } from 'vue'
import { CreateComponentType } from '../../../../../packages/index.d'
import { option } from './config'
import { useRouter } from 'vue-router'
import { PageEnum } from '../../../../../enums/pageEnum'

const router = useRouter()

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType & typeof option>,
    required: true
  }
})

let { color } = toRefs(props.chartConfig.option)

const clickExit = () => {
  router.replace({
    path: PageEnum.BASE_HOME_ITEMS
  })
}
</script>

<style lang="scss" scoped>
svg {
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
