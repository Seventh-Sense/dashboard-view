<template>
  <v-chart :option="option" autoresize />
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import { computed, onMounted, ref } from 'vue'
import { getRandomInt } from '@/utils'
import * as echarts from 'echarts'

const data = ref<any>([])

onMounted(() => {
  // 可以在这里获取数据
  madeData()
  window.setInterval(() => {
    madeData()
  }, 3000)
})

const madeData = () => {
  let tmp: any[] = []

  for (let i = 1; i < 37; i++) {
    tmp.push([i, getRandomInt(300, 500)])
  }

  data.value = tmp
}

const option = computed(() => {
  return {
    dataZoom: [
      {
        type: 'inside',
        minValueSpan: 1000,
        show: 8,
        start: 0,
        end: 100
      }
    ],
    xAxis: [
      {
        type: 'category',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          color: 'rgba(255,255,255,0.6)',
          hideOverlap: true,

        }
      }
    ],
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      }
    },
    grid: {
      bottom: '20',
      top: '0',
      left: '0',
      right: '0'
    },
    series: [
      {
        name: '2',
        nameShow: '电力',
        type: 'bar',
        symbol: 'none',
        symbolSize: 10,
        barMaxWidth: 15,
        stack: 0,
        stackStrategy: 0,
        barGap: 0,
        itemStyle: {
          borderRadius: [10, 10, 0, 0]
        },
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#6666FF' },

          { offset: 1, color: 'rgba(109,87,163,1)' }
        ]),
        lineStyle: {
          width: 3,
          color: '#6666FF'
        },
        data: data.value
      }
    ]
  }
})
</script>

<style lang="scss" scoped></style>
