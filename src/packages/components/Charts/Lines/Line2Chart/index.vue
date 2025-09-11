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
  '2025-09-07T00:00:00.000Z',
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

  names.value.forEach((name: string) => {
    data_1.value.push([name, getRandomInt(0, 5000)])
    data_2.value.push([name, getRandomInt(0, 5000)])
  })
}

const option = computed(() => {
  return {
    legend: {
      type: 'scroll',
      icon: 'circle',
      top: '10',
      left: '20',
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
        type: 'inside'
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
        name: '计划排放',
        nameShow: '系统A_MV2',
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
        data: data_1.value,
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
      },
      {
        name: '实际排放',
        nameShow: 'MV_test1',
        type: 'line',
        symbol: 'none',
        symbolSize: 10,
        barMaxWidth: 15,
        smooth: true,
        itemStyle: {
          color: '#00CED1',
          borderRadius: [10, 10, 0, 0]
        },
        lineStyle: {
          width: 3,
          color: '#00CED1'
        },
        data: data_2.value,
        areaStyle: {
          color: {
            colorStops: [
              {
                offset: 0,
                color: 'rgba(0, 206, 209, 0.6)'
              },
              {
                offset: 1,
                color: 'rgba(0, 206, 209, 0.1)'
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
