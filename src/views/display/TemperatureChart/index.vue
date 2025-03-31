<!-- EChartsWrapper.vue -->
<template>
  <div class="card">
    <div class="card-title">温度对比折线图</div>

    <div ref="chartDom" class="card-chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts/core'
import type { ECharts } from 'echarts/core'
import { ECOption, newA, newB } from '../util/util'
import { readChartData } from '@/api/http'

const props = defineProps({
  data: Object
})

const chartDom = ref<HTMLElement>()
let chartInstance: ECharts | null = null

const options = ref<ECOption>({
  legend: {
    data: ['常规性调节', '预测性调节'],
    top: 10,
    itemGap: 200,
    itemWidth: 0,
    itemHeight: 40,
    textStyle: {
      rich: {
        // 定义图标区块
        icon: {
          height: 4, // 色块高度
          width: 24, // 色块宽度
          align: 'center',
          verticalAlign: 'bottom',
          borderRadius: 2,
          textBorderWidth: 0, // 清除文本描边
          textBackgroundColor: 'transparent', // 透明文本背景
          color: 'transparent', // 隐藏文本颜色
          backgroundColor: '{c|}' // 声明参数占位符 {c}
        },
        // 定义文字区块
        text: {
          height: 20,
          align: 'center',
          verticalAlign: 'top',
          fontSize: 12,
          color: 'rgba(255,255,255,0.53)',
          padding: [8, 0, 0, 0] // 文字上方留出间距
        }
      }
    },

    icon: 'none',
    // 自定义富文本格式
    formatter: function (name: any) {
      const colorMap: any = {
        常规性调节: '#6666FF',
        预测性调节: '#00CED1'
      }
      return `{icon|${colorMap[name]}}\n{text|${name}}`
    }
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
    type: 'time',
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
    min: 21.0,
    max: 25.0,
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
  },
  series: [
    {
      name: '常规性调节',
      type: 'line',
      data: [],
      smooth: true,
      symbol: 'none',
      lineStyle: {
        color: '#6666FF',
        width: 2
      },
      itemStyle: { color: '#6666FF' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#6666FF' },
          { offset: 1, color: 'rgba(0, 0, 0, 0)' }
        ])
      }
    },
    {
      name: '预测性调节',
      type: 'line',
      data: [],
      smooth: true,
      symbol: 'none',
      lineStyle: {
        color: '#00CED1 ',
        width: 2
      },
      itemStyle: { color: '#00CED1' }
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

// 响应式更新
watch(
  () => props.data,
  newData => {
    //console.log(newData)
    chartInstance?.setOption({
      series: [
        {
          data: newData!.regular_temp
        },
        {
          data: newData!.ai_temp
        }
      ]
    })
  },
  { deep: true }
)

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
