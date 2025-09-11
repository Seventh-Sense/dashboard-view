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

  for (let i = 1; i < 30; i++) {
    tmp.push([i, getRandomInt(30, 35)])
  }

  data.value = tmp
}

const option = computed(() => {
  return {
    dataZoom: [
      {
        type: 'inside'
      }
    ],
    xAxis: {
      type: 'category',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      }
    },
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
      bottom: '10',
      top: '45',
      left: '0',
      right: '0'
    },
    series: [
      {
        name: '2',
        nameShow: '电力',
        type: 'line',
        symbol: 'none',
        symbolSize: 10,
        barMaxWidth: 15,
        smooth: true,
        itemStyle: {
          color: '#6666FF',
          borderRadius: [10, 10, 0, 0]
        },
        lineStyle: {
          width: 3,
          color: '#6666FF'
        },
        data: data.value,
        areaStyle: {
          color: {
            colorStops: [
              {
                offset: 0,
                color: 'rgba(102, 102, 255, 0.6)'
              },
              {
                offset: 1,
                color: 'rgba(102, 102, 255, 0.1)'
              }
            ],
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            type: 'linear',
            global: false
          }
        }
      }
    ]
  }
})
</script>

<style lang="scss" scoped></style>
