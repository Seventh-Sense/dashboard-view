<template>
  <div
    class="container"
    :style="{
      width: w + 'px',
      height: h + 'px',
      ...bgStyle
    }"
  >
    <div class="container-top">
      <div
        :style="{
          fontSize: title_size + 'px',
          color: title_color
        }"
      >
        {{ title }}
      </div>
      <div v-if="value < conditions" class="container-right">
        <Icon name="checkCircle" type="mono-line" :color="{normal: '#3bd695'}" :size="icon_size" />
        <span
          class="good"
          :style="{
            fontSize: icon_text_size + 'px'
          }"
        >
          {{t('dashboard.excellent')}}
        </span>
      </div>
      <div v-else class="container-right">
        <Icon name="dismissCircle" type="mono-line" :color="{normal: '#f76f83'}" :size="icon_size" />
        <span
          class="bad"
          :style="{
            fontSize: icon_text_size + 'px'
          }"
        >
          {{t('dashboard.bad')}}
        </span>
      </div>
    </div>

    <div class="container-data">
      <div
        class="container-value"
        :style="{
          fontSize: data_size + 'px',
          color: data_color
        }"
      >
        {{ value }}
      </div>
      <div
        :style="{
          fontSize: unit_size + 'px',
          color: unit_color
        }"
      >
        {{ unit }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch, toRefs, ref, computed } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import air1 from '@/assets/pictures/air1.png'
import air2 from '@/assets/pictures/air2.png'
import air3 from '@/assets/pictures/air3.png'
import { Icon } from '@/icon/index'
import { parseData } from '@/utils'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})
const t = window['$t']
const value = ref<any>(26)

const {
  bg_png,
  title,
  title_size,
  title_color,
  data_size,
  data_color,
  unit,
  unit_size,
  unit_color,
  conditions,
  icon_text_size,
  icon_size
} = toRefs(props.chartConfig.option)

const { w, h } = toRefs(props.chartConfig.attr)

const bgStyle = computed(() => {
  let image = air1
  if (bg_png.value === 2) {
    image = air2
  } else if (bg_png.value === 3) {
    image = air3
  }
  return {
    backgroundImage: `url(${image})`,
  }
})

watch(
  () => props.chartConfig.option.dataset,
  newVal => {
    value.value = parseData(newVal, 'number')
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss" scoped>
.container {
  border-radius: 6px;
  backdrop-filter: blur(32px);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 16px 16px 0 16px;

  &-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-data {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    gap: 4px;
  }

  &-value {
    font-weight: bold;
  }

  &-right {
    display: flex;

    align-items: center;
    gap: 4px;
  }
}

.good {
  font-weight: 400;
  color: #3bd695;
  font-style: normal;
}

.bad {
  font-weight: 400;
  color: #f76f83;
  font-style: normal;
}
</style>
