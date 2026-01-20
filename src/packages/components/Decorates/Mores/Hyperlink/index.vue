<template>
  <div
    class="button"
    :style="{
      width: w + 'px',
      height: h + 'px',
      borderRadius: radius + 'px',
      '--bg-color-0': background_0,
      '--bg-color-100': background_100
    }"
    @click="onClick"
  >
    <span
      :style="{
        fontSize: fontSize + 'px',
        color: fontColor
      }"
    >
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { getLocalStorage, routerTurnByName, routerTurnByPath } from '@/utils'
import { PageEnum } from '@/enums/pageEnum'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { w, h } = toRefs(props.chartConfig.attr)
const { background_0, background_100, href, text, fontSize, fontColor, radius, mode } = toRefs(
  props.chartConfig.option
)

const onClick = () => {
  if (href.value !== '') {
    if (mode.value === 1) {
      //自定义
      window.location.href = href.value
    } else if (mode.value === 2) {
      let link = '/chart/preview'

      let config = getLocalStorage('ProjectInfo')
      if (config && Array.isArray(config)) {
        const matchItem = config.find((item: any) => item.id === href.value)
        if (matchItem && matchItem.type === 'graphic') {
          link = '/graphic/preview'
        }
      }
      routerTurnByPath(link, [href.value], false, false)
    } else if (mode.value === 3) {
      //主页
      routerTurnByName(PageEnum.BASE_VANT_NAME, true)
      //window.location.href = window.location.origin + href.value
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    149% 100% at 50% 100%,
    var(--bg-color-0, #00ced1) 0%,
    var(--bg-color-100, #6666ff) 100%
  );
  cursor: pointer;
}
</style>
