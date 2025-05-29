<template>
  <Icon v-if="type === 1" name="exit" :size="h" @click="clickExit" />
  <Icon v-else name="logo" type="mono-filled" :size="h" @click="clickExit" />
</template>

<script setup lang="ts">
import { PropType, toRefs } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { useRouter } from 'vue-router'
import { PageEnum } from '@/enums/pageEnum'
import { Icon } from '@/icon/index'

const router = useRouter()

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { type, size } = toRefs(props.chartConfig.option)
const { w, h } = toRefs(props.chartConfig.attr)

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
