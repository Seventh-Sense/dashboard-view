<!-- EChartsWrapper.vue -->
<template>
  <div class="card">
    <div class="card-title">温度对比折线图</div>

    <div id="chartDom" class="card-chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart } from '@antv/g2'

const props = defineProps({
  data: Object
})

const data = [
  { month: 'Jan', city: 'Tokyo', temperature: 7 },
  { month: 'Jan', city: 'London', temperature: 3.9 },
  { month: 'Feb', city: 'Tokyo', temperature: 6.9 },
  { month: 'Feb', city: 'London', temperature: 4.2 },
  { month: 'Mar', city: 'Tokyo', temperature: 9.5 },
  { month: 'Mar', city: 'London', temperature: 5.7 },
  { month: 'Apr', city: 'Tokyo', temperature: 14.5 },
  { month: 'Apr', city: 'London', temperature: 8.5 },
  { month: 'May', city: 'Tokyo', temperature: 18.4 },
  { month: 'May', city: 'London', temperature: 11.9 },
  { month: 'Jun', city: 'Tokyo', temperature: 21.5 },
  { month: 'Jun', city: 'London', temperature: 15.2 },
  { month: 'Jul', city: 'Tokyo', temperature: 25.2 },
  { month: 'Jul', city: 'London', temperature: 17 },
  { month: 'Aug', city: 'Tokyo', temperature: 26.5 },
  { month: 'Aug', city: 'London', temperature: 16.6 },
  { month: 'Sep', city: 'Tokyo', temperature: 23.3 },
  { month: 'Sep', city: 'London', temperature: 14.2 },
  { month: 'Oct', city: 'Tokyo', temperature: 18.3 },
  { month: 'Oct', city: 'London', temperature: 10.3 },
  { month: 'Nov', city: 'Tokyo', temperature: 13.9 },
  { month: 'Nov', city: 'London', temperature: 6.6 },
  { month: 'Dec', city: 'Tokyo', temperature: 9.6 },
  { month: 'Dec', city: 'London', temperature: 4.8 }
]

onMounted(() => {
  const chart = new Chart({
    container: 'chartDom',

    autoFit: true
  })

  chart
    .data(data)
    .encode('x', 'month')
    .encode('y', 'temperature')
    .encode('color', 'city')
    .scale('x', {
      range: [0, 1]
    })
    .scale('y', {
      nice: true
    })
    .axis('y', { labelFormatter: (d: any) => d + '°C' })

  chart.line().encode('shape', 'smooth')

  chart.point().encode('shape', 'point').tooltip(false)

  chart.render()
})

onUnmounted(() => {})

// 响应式更新
watch(
  () => props.data,
  newData => {
    //console.log(newData)
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;

  height: 100%;
  padding: 6px 12px 10px 12px;

  &-title {
    height: 40px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    color: #ffffff;
    line-height: 24px;
    text-align: left;
    font-style: normal;
  }

  &-chart {
    height: calc(100vh - 316px - 98px - 40px - 6px - 10px - 6px);
    width: 100%;
  }
}
</style>
