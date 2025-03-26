<template>
  <div class="card">
    <div class="card-title">能耗对比</div>

    <div ref="chartDom" class="card-chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts/core'
import type { ECharts } from 'echarts/core'
import { ECOption, array2, array1, xa } from '../util/util'

const chartDom = ref<HTMLElement>()
let chartInstance: ECharts | null = null

const options = ref<ECOption>({
  legend: {
    data: ['常规性调节', '预测性调节'],
    top: 10,
    itemGap: 200,

    textStyle: {
      color: 'rgba(255,255,255,0.53)'
    },
    icon: 'circle'
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(40,40,40,0.9)',
    borderColor: '#555',
    axisPointer: {
      type: 'cross',
      lineStyle: {
        color: '#666'
      }
    },
    textStyle: {
      color: '#fff'
    }
  },
  xAxis: {
    show: true,
    type: 'category',
    data: xa,
    splitLine: {
      show: false
    },
    axisTick: { show: false },
    axisLine: {
      show: true,
      lineStyle: {
        width: 3,
        color: 'rgba(255,255,255,0.2)',
        type: 'solid'
      }
    },
    axisLabel: {
      color: 'rgba(255,255,255,0.53)',
      margin: 16
    }
  },
  yAxis: {
    type: 'value',
    min: 20.0,
    max: 30.0,
    axisLine: {
      show: false
    },
    axisTick: { show: false },
    axisLabel: {
      color: 'rgba(255,255,255,0.53)',
      margin: 16,
      formatter: (value: number) => value.toFixed(1)
    },
    splitLine: {
      show: true,
      showMinLine: false,
      lineStyle: {
        color: 'rgba(255,255,255,0.2)',
        type: 'dashed'
      }
    },
    interval: 1.2
  },
  series: [
    {
      name: '常规性调节',
      type: 'bar',
      data: array1,
      itemStyle: {
        borderRadius: [8, 8, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(102, 102, 255, 0.53)' },
          { offset: 1, color: 'rgba(102, 102, 255, 0)' }
        ])
      }
    },
    {
      name: '预测性调节',
      type: 'bar',
      data: array2,

      itemStyle: {
        borderRadius: [8, 8, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(0, 206, 209, 0.53)' },
          { offset: 1, color: 'rgba(102, 102, 255, 0)' }
        ])
      }
    }
  ],
  grid: {
    top: 80,
    bottom: 30,
    left: 50,
    right: 30
  },
  backgroundColor: '#181621'
})

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})

// 初始化图表
const initChart = () => {
  if (chartDom.value) {
    chartInstance = echarts.init(chartDom.value, '#181621')
    chartInstance.setOption(options.value)
  }
}

// 窗口自适应
const handleResize = () => chartInstance?.resize()
window.addEventListener('resize', handleResize)
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
