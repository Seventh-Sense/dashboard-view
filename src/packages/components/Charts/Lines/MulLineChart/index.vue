<template>
  <v-chart :option="option" autoresize />
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import { computed, onMounted, ref } from 'vue'
import { getRandomInt } from '@/utils'
import * as echarts from 'echarts'

const data_1 = ref<any>([])
const data_2 = ref<any>([])
const data_3 = ref<any>([])

onMounted(() => {
  // 可以在这里获取数据
  madeData()
  window.setInterval(() => {
    madeData()
  }, 3000)
})

const madeData = () => {
  let tmp_1: any[] = []

  for (let i = 1; i < 10; i++) {
    tmp_1.push([i, getRandomInt(0, 100)])
  }

  data_1.value = tmp_1

  let tmp_2: any[] = []

  for (let i = 1; i < 10; i++) {
    tmp_2.push([i, getRandomInt(0, 100)])
  }

  data_2.value = tmp_2

  let tmp_3: any[] = []

  for (let i = 1; i < 10; i++) {
    tmp_3.push([i, getRandomInt(0, 100)])
  }

  data_3.value = tmp_3
}

const option = computed(() => {
  return {
    legend: {
      type: 'scroll',
      icon: 'circle',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 10,
      textStyle: {
        fontSize: 12,
        color: '#ccc'
      },
      tooltip: {
        show: true,
        confine: true,
        appendToBody: true
      },
      pageTextStyle: {
        color: '#999'
      },
      pageIconColor: '#ccc',
      pageIconInactiveColor: '#666'
    },
    dataZoom: [
      {
        type: 'inside',
      }
    ],
    xAxis: [
      {
        type: 'category',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false,
        }
      }
    ],
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
        
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false,
      }
    },
    tooltip: {
      show: false
    },
    grid: {
      bottom: '0',
      top: '45',
      left: '0',
      right: '0'
    },
    series: [
      {
        name: '一号',
        type: 'line',
        smooth: true,
        symbol: 'none',
        symbolSize: 10,
        itemStyle: {
          color: 'rgba(106,99,255,1)'
        },
        lineStyle: {
          width: 3,
          color: 'rgba(106,99,255,1)'
        },
        data: data_1.value
      },
      {
        name: '二号',
        type: 'line',
        smooth: true,
        symbol: 'none',
        symbolSize: 10,
        itemStyle: {
          color: 'rgba(0,204,192,1)'
        },
        lineStyle: {
          width: 3,
          color: 'rgba(0,204,192,1)'
        },
        data: data_2.value
      },
      {
        name: '三号',
        type: 'line',
        smooth: true,
        symbol: 'none',
        symbolSize: 10,
        itemStyle: {
          color: 'rgba(133,92,237,1)'
        },
        lineStyle: {
          width: 3,
          color: 'rgba(133,92,237,1)'
        },
        data: data_3.value
      }
    ]
  }
})
</script>

<style lang="scss" scoped></style>
