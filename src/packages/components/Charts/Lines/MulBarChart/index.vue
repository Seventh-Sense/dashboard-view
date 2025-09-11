<template>
  <v-chart :option="option" autoresize />
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import { computed, onMounted, ref } from 'vue'
import { getRandomInt } from '@/utils'
import * as echarts from 'echarts'

const data_l1 = ref<any>([])
const data_l2 = ref<any>([])
const data_l3 = ref<any>([])
const data_l4 = ref<any>([])
const data_l5 = ref<any>([])
const names = ref(['L1', 'L2', 'L3', 'L4', 'L5'])

onMounted(() => {
  // 可以在这里获取数据
  madeData()
  window.setInterval(() => {
    madeData()
  }, 3000)
})

const madeData = () => {
  data_l1.value = []
  data_l2.value = []
  data_l3.value = []
  data_l4.value = []
  data_l5.value = []

  names.value.forEach((name: string) => {
    data_l1.value.push([name, getRandomInt(300, 500)])
    data_l2.value.push([name, getRandomInt(300, 500)])
    data_l3.value.push([name, getRandomInt(300, 500)])
    data_l4.value.push([name, getRandomInt(300, 500)])
    data_l5.value.push([name, getRandomInt(300, 500)])
  })
}

const option = computed(() => {
  return {
    legend: {
      show: true,
      type: 'scroll',
      icon: 'circle',
      itemWidth: 16,
      itemHeight: 16,
      itemGap: 10,
      textStyle: {
        fontSize: 16,
        color: '#ccc'
      },
      tooltip: {
        show: true,
        appendToBody: true
      },
      pageTextStyle: {
        color: 'rgba(136,140,143,1)'
      },
      pageIconColor: 'rgba(136,140,143,1)',
      pageIconInactiveColor: '#666'
    },

    dataZoom: [
      {
        type: 'inside'
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
          color: 'rgba(136,140,143,1)',
          hideOverlap: true
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
      bottom: '30',
      top: '55',
      left: '0',
      right: '0'
    },
    series: [
      {
        name: '空调',
        nameShow: '空调',
        type: 'bar',
        symbol: 'none',
        symbolSize: 10,
        barMaxWidth: 10,
        stack: 0,
        stackStrategy: 0,
        barGap: '20%',
        itemStyle: {
          color: 'rgba(109,107,217,1)',
          borderRadius: [10, 10, 0, 0]
        },
        lineStyle: {
          width: 3,
          color: 'rgba(109,107,217,1)'
        },
        data: data_l1.value
      },
      {
        name: '照明',
        nameShow: '照明',
        type: 'bar',
        symbol: 'none',
        symbolSize: 10,
        barMaxWidth: 10,
        stack: 0,
        stackStrategy: 0,
        barGap: '20%',
        itemStyle: {
          color: 'rgba(24,192,195,1)',
          borderRadius: [10, 10, 0, 0]
        },
        lineStyle: {
          width: 3,
          color: 'rgba(24,192,195,1)'
        },
        data: data_l2.value
      },
      {
        name: '厨房',
        nameShow: '厨房',
        type: 'bar',
        symbol: 'none',
        symbolSize: 10,
        barMaxWidth: 10,
        stack: 0,
        stackStrategy: 0,
        barGap: '20%',
        itemStyle: {
          color: 'rgba(138,94,202,1)',
          borderRadius: [10, 10, 0, 0]
        },
        lineStyle: {
          width: 3,
          color: 'rgba(138,94,202,1)'
        },
        data: data_l3.value
      },
      {
        name: '插座',
        nameShow: '插座',
        type: 'bar',
        symbol: 'none',
        symbolSize: 10,
        barMaxWidth: 10,
        stack: 0,
        stackStrategy: 0,
        barGap: '20%',
        itemStyle: {
          color: 'rgba(220,117,130,1)',
          borderRadius: [10, 10, 0, 0]
        },
        lineStyle: {
          width: 3,
          color: 'rgba(220,117,130,1)'
        },
        data: data_l3.value
      },
      {
        name: '电梯',
        nameShow: '电梯',
        type: 'bar',
        symbol: 'none',
        symbolSize: 10,
        barMaxWidth: 10,
        stack: 0,
        stackStrategy: 0,
        barGap: '20%',
        itemStyle: {
          color: 'rgba(240,222,128,1)',
          borderRadius: [10, 10, 0, 0]
        },
        lineStyle: {
          width: 3,
          color: 'rgba(240,222,128,1)'
        },
        data: data_l3.value
      }
    ]
  }
})
</script>

<style lang="scss" scoped></style>
