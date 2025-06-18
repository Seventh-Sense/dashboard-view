<template>
  <div class="switch-bg">
    <div>

    </div>
    <div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs, shallowReactive, watch, ref } from 'vue'
import { CreateComponentType } from '@/packages/index.d'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const t = window['$t']

const { background } = toRefs(props.chartConfig.option)
</script>

<style lang="scss" scoped>

.switch-bg {
    background-color: v-bind('background');
    padding: 4px;
}
</style>
