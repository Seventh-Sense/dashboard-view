<template>
  <v-chart :option="option" autoresize />
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import { computed, onMounted, ref } from 'vue'
import { getRandomNumber } from '@/utils'
import * as echarts from 'echarts'

const data_1 = ref<any>([])
const data_2 = ref<any>([])
const data_3 = ref<any>([])

const names = ref([
  '2025-08-28T00:00:00.000Z',
  '2025-08-29T00:00:00.000Z',
  '2025-08-30T00:00:00.000Z',
  '2025-08-31T00:00:00.000Z',
  '2025-09-01T00:00:00.000Z',
  '2025-09-02T00:00:00.000Z',
  '2025-09-02T00:00:00.000Z',
  '2025-09-03T00:00:00.000Z',
  '2025-09-04T00:00:00.000Z',
  '2025-09-05T00:00:00.000Z',
  '2025-09-06T00:00:00.000Z',
  '2025-09-07T00:00:00.000Z'
])

onMounted(() => {
  // 可以在这里获取数据
  madeData()
  window.setInterval(() => {
    madeData()
  }, 3000)
})

const madeData = () => {
  data_1.value = []
  data_2.value = []
  data_3.value = []

  names.value.forEach((name: string) => {
    data_1.value.push([name, getRandomNumber(-3000, 4000)])
    data_2.value.push([name, getRandomNumber(-3000, 4000)])
    data_3.value.push([name, getRandomNumber(-3000, 4000)])
  })
}

const option = computed(() => {
  return {
    legend: {
      show: true,
      top: '10',
      left: '20',
      data: [
        {
          name: '空调用电',
          icon: 'pin'
        },
        {
          name: '工业用电',
          icon: 'roundRect'
        },
        {
          name: '照明',
          icon: 'pin'
        }
      ],
      type: 'scroll',
      itemWidth: 20,
      itemHeight: 5,
      itemGap: 15,
      textStyle: {
        rich: {
          a: {
            align: 'center',
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
            width: 5,
            padding: [35, 0, 0, -25]
          }
        }
      },
      tooltip: {
        show: true,
        appendToBody: true
      },
      pageTextStyle: {
        color: 'rgba(255,255,255,0.6)'
      },
      pageIconColor: 'rgba(255,255,255,0.6)',
      pageIconInactiveColor: '#666'
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      appendToBody: true,
      backgroundColor: '#2e3847',
      borderColor: '#475264',
      enterable: true,
      hideDelay: 200,
      axisPointer: {
        type: 'shadow'
      },
      textStyle: {
        color: '#ccc'
      }
    },
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
        type: 'time',
        axisLine: {
          show: true,
          onZero: true,
          lineStyle: {
            color: 'rgba(255,255,255,0.6)'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          color: 'rgba(255,255,255,0.6)',
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
        show: true,
        width: 1,
        lineStyle: {
          type: 'dashed',
          opacity: 0.5,
          cap: 'butt'
        }
      },
      axisLabel: {
        show: true,
        color: 'rgba(255,255,255,0.6)'
      }
    },
    grid: {
      bottom: '20',
      top: '55',
      left: '45',
      right: '10'
    },
    series: [
      {
        name: '空调用电',
        nameShow: 'MV_test1',
        type: 'bar',
        symbol: 'none',
        symbolSize: 10,
        barMaxWidth: 15,
        stack: 0,
        stackStrategy: 0,
        barGap: '-100%',
        itemStyle: {
          color: '#6666FF',
          borderRadius: [0, 0, 0, 0]
        },
        lineStyle: {
          width: 3,
          color: '#6666FF'
        },
        data:data_1.value
      },
      {
        name: '工业用电',
        nameShow: '系统A_MV1',
        type: 'line',
        symbol: 'none',
        symbolSize: 10,
        barMaxWidth: 15,
        stack: 0,
        stackStrategy: 0,
        barGap: 0,
        itemStyle: {
          color: '#00CED1',
          borderRadius: [0, 0, 0, 0]
        },
        lineStyle: {
          width: 3,
          color: '#00CED1'
        },
        data: data_2.value
      },
      {
        name: '照明',
        nameShow: 'MV_系统测试1',
        type: 'bar',
        symbol: 'none',
        symbolSize: 10,
        barMaxWidth: 15,
        stack: 0,
        stackStrategy: 0,
        barGap: '-100%',
        itemStyle: {
          color: 'rgba(90,88,101,1)',
          borderRadius: [0, 0, 0, 0]
        },
        lineStyle: {
          width: 3,
          color: 'rgba(148,87,235,0.52)'
        },
        data: data_3.value
      }
    ]
  }
})
</script>

<style lang="scss" scoped></style>
