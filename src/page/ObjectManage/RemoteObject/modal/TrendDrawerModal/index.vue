<template>
  <n-drawer
    :show="isShow"
    @update:show="onUpdateShow"
    :width="'75%'"
    placement="right"
    :mask-closable="false"
    :closable="false"
  >
    <n-drawer-content
      class="drawer"
      :class="{ 'dark-theme': designStore.darkTheme }"
    >
      <template #header>
        <div class="drawer-header">
          <span class="drawer-title">{{ $t('device.trend') }}</span>
          <n-icon size="40" :depth="1" class="drawer-close" @click="onClose">
            <CloseOutlineIcon />
          </n-icon>
        </div>
      </template>

      <div class="drawer-content">
        <!-- 时间选择器 -->
        <div class="time-selector">
          <div class="time-row">
            <div class="time-range">
              <n-date-picker
                v-model="startTime"
                type="datetime"
                :placeholder="$t('device.start_time')"
                @update:value="onTimeChange"
              />
              <span class="time-separator">至</span>
              <n-date-picker
                v-model="endTime"
                type="datetime"
                :placeholder="$t('device.end_time')"
                @update:value="onTimeChange"
              />
            </div>
            <n-button class="action-button" @click="refreshData">
              {{ $t('device.refresh') }}
            </n-button>
            <n-button class="action-button" @click="downloadData">
              {{ $t('device.download') }}
            </n-button>
          </div>
          <div class="quick-row">
            <n-button-group class="quick-select">
              <n-button
                v-for="option in timeOptions"
                :key="option.value"
                :type="selectedTimeOption === option.value ? 'primary' : 'tertiary'"
                size="small"
                @click="selectTimeRange(option.value)"
              >
                {{ option.label }}
              </n-button>
            </n-button-group>
          </div>
        </div>

        <!-- 图表容器 -->
        <div ref="chartRef" class="chart-container"></div>

        <!-- 数据统计 -->
        <div class="data-summary" v-if="chartData.length > 0">
          <n-space :spacing="24">
            <div class="summary-item">
              <span class="summary-label">{{ $t('device.min') }}</span>
              <span class="summary-value">{{ minValue }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">{{ $t('device.max') }}</span>
              <span class="summary-value">{{ maxValue }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">{{ $t('device.average') }}</span>
              <span class="summary-value">{{ avgValue }}</span>

            </div>
            <div class="summary-item">
              <span class="summary-label">{{ $t('device.count') }}</span>
              <span class="summary-value">{{ chartData.length }}</span>
            </div>
          </n-space>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { icon } from '@/plugins'
import * as echarts from 'echarts'

const t = window['$t']

const designStore = useDesignStore()
const { CloseOutlineIcon } = icon.ionicons5

const emit = defineEmits(['update:isShow'])

const props = defineProps<{
  isShow: boolean
}>()

// 图表引用
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 时间选择
const startTime = ref<Date | null>(null)
const endTime = ref<Date | null>(null)
const selectedTimeOption = ref('1h')

// 图表数据
const chartData = ref<{ time: string; value: number }[]>([])

// 时间选项
const timeOptions = [
  { label: '1小时', value: '1h' },
  { label: '6小时', value: '6h' },
  { label: '12小时', value: '12h' },
  { label: '24小时', value: '24h' },
  { label: '7天', value: '7d' },
  { label: '30天', value: '30d' }
]

// 计算统计值
const minValue = computed(() => {
  if (chartData.value.length === 0) return '-'
  return Math.min(...chartData.value.map(d => d.value)).toFixed(2)
})

const maxValue = computed(() => {
  if (chartData.value.length === 0) return '-'
  return Math.max(...chartData.value.map(d => d.value)).toFixed(2)
})

const avgValue = computed(() => {
  if (chartData.value.length === 0) return '-'
  const sum = chartData.value.reduce((acc, d) => acc + d.value, 0)
  return (sum / chartData.value.length).toFixed(2)
})

// 初始化时间范围
const initTimeRange = () => {
  const now = new Date()
  endTime.value = now
  startTime.value = new Date(now.getTime() - 3600000) // 默认1小时前
}

// 选择时间范围
const selectTimeRange = (range: string) => {
  selectedTimeOption.value = range
  const now = new Date()
  endTime.value = now
  
  let milliseconds = 3600000 // 默认1小时
  switch (range) {
    case '1h':
      milliseconds = 3600000
      break
    case '6h':
      milliseconds = 6 * 3600000
      break
    case '12h':
      milliseconds = 12 * 3600000
      break
    case '24h':
      milliseconds = 24 * 3600000
      break
    case '7d':
      milliseconds = 7 * 24 * 3600000
      break
    case '30d':
      milliseconds = 30 * 24 * 3600000
      break
  }
  startTime.value = new Date(now.getTime() - milliseconds)
  fetchHistoryData()
}

// 时间变化处理
const onTimeChange = () => {
  selectedTimeOption.value = ''
  fetchHistoryData()
}

// 获取历史数据
const fetchHistoryData = async () => {
  try {
    // 这里应该调用历史数据API，目前先用模拟数据
    const mockData = generateMockData()
    //console.log(mockData)
    chartData.value = mockData
    // 确保图表实例已创建后再更新
    if (chartInstance) {
      updateChart()
    }
  } catch (error) {
    console.error('TrendDrawerModal: 获取历史数据失败', error)
  }
}

// 生成模拟数据
const generateMockData = (): { time: string; value: number }[] => {
  const data: { time: string; value: number }[] = []
  const now = new Date()
  const start = startTime.value || new Date(now.getTime() - 3600000)
  
  const interval = (now.getTime() - start.getTime()) / 60 // 60个数据点
  let current = start
  
  for (let i = 0; i < 60; i++) {
    const timeStr = formatDateTime(current)
    // 生成模拟数值，基于正弦函数产生波动
    const value = 25 + Math.sin(i * 0.3) * 5 + Math.random() * 2
    data.push({ time: timeStr, value })
    current = new Date(current.getTime() + interval)
  }
  
  return data
}

// 格式化日期时间
const formatDateTime = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

// 更新图表
const updateChart = () => {
  if (!chartInstance || chartData.value.length === 0) return

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(26, 26, 46, 0.95)',
      borderColor: 'rgba(102, 102, 255, 0.3)',
      borderWidth: 1,
      padding: [12, 16],
      textStyle: {
        color: '#fff',
        fontSize: 14
      },
      formatter: (params: any) => {
        const data = params[0]
        return `<div style="font-weight: 600; margin-bottom: 4px;">${data.name}</div>
                <div style="color: #8888FF; font-size: 16px; font-weight: 700;">${data.seriesName}: ${data.value.toFixed(2)}</div>`
      },
      extraCssText: 'border-radius: 12px; box-shadow: 0 8px 32px rgba(102, 102, 255, 0.3);'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '24%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.value.map(d => d.time),
      axisLine: {
        lineStyle: {
          color: 'rgba(102, 102, 255, 0.3)'
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 11,
        fontWeight: 400,
        interval: 'auto',
        formatter: (value: string) => {
          const parts = value.split(' ')
          if (parts.length >= 2) {
            return `{date|${parts[0]}}\n{time|${parts[1]}}`
          }
          return value
        },
        rich: {
          date: {
            color: '#888',
            fontSize: 10
          },
          time: {
            color: '#666',
            fontSize: 11
          }
        }
      },
      axisTick: {
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
        lineStyle: {
          color: 'rgba(102, 102, 255, 0.1)',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#888',
        fontSize: 11
      }
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
        zoomOnMouseWheel: true,
        moveOnMouseMove: true
      },
      {
        type: 'slider',
        start: 0,
        end: 100,
        height: 24,
        bottom: 8,
        borderColor: 'rgba(102, 102, 255, 0.2)',
        backgroundColor: 'rgba(26, 26, 46, 0.6)',
        fillerColor: 'rgba(102, 102, 255, 0.25)',
        handleStyle: {
          color: '#8888FF',
          borderColor: '#aaaaff',
          borderWidth: 2,
          shadowBlur: 10,
          shadowColor: 'rgba(102, 102, 255, 0.5)'
        },
        textStyle: {
          color: '#888',
          fontSize: 11
        },
        brushSelect: false
      }
    ],
    series: [
      {
        name: t('device.chart_value'),
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        symbolOffset: [0, 0],
        lineStyle: {
          width: 3,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#6666FF' },
            { offset: 0.5, color: '#9966FF' },
            { offset: 1, color: '#6699FF' }
          ]),
          shadowColor: 'rgba(102, 102, 255, 0.5)',
          shadowBlur: 10,
          shadowOffsetY: 5
        },
        itemStyle: {
          color: '#8888FF',
          borderColor: '#fff',
          borderWidth: 2,
          shadowColor: 'rgba(102, 102, 255, 0.8)',
          shadowBlur: 15
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(102, 102, 255, 0.45)' },
            { offset: 0.3, color: 'rgba(136, 136, 255, 0.25)' },
            { offset: 0.7, color: 'rgba(102, 153, 255, 0.1)' },
            { offset: 1, color: 'rgba(102, 153, 255, 0.02)' }
          ])
        },
        emphasis: {
          scale: true,
          focus: 'series',
          itemStyle: {
            color: '#fff',
            borderColor: '#8888FF',
            borderWidth: 3,
            shadowBlur: 20,
            shadowColor: 'rgba(102, 102, 255, 0.8)'
          }
        },
        data: chartData.value.map(d => d.value)
      }
    ]
  }

  chartInstance.setOption(option, true)
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) {
    console.warn('TrendDrawerModal: chartRef is null')
    return
  }
  
  const rect = chartRef.value.getBoundingClientRect()
  console.log('TrendDrawerModal: chart container size:', rect.width, 'x', rect.height)
  
  if (rect.width === 0 || rect.height === 0) {
    console.warn('TrendDrawerModal: chart container has zero size, retrying...')
    setTimeout(initChart, 100)
    return
  }
  
  chartInstance = echarts.init(chartRef.value)
  updateChart()

  // 响应式调整
  window.addEventListener('resize', handleResize)
}

const handleResize = () => {
  chartInstance?.resize()
}

// 刷新数据
const refreshData = () => {
  fetchHistoryData()
}

// 下载数据
const downloadData = () => {
  if (chartData.value.length === 0) {
    return
  }
  
  const start = startTime.value ? formatDateTime(startTime.value) : 'N/A'
  const end = endTime.value ? formatDateTime(endTime.value) : 'N/A'
  
  const csvHeader = '\uFEFF时间,数值\n'
  const csvContent = chartData.value.map(d => `${d.time},${d.value.toFixed(2)}`).join('\n')
  const csv = `${csvHeader}${csvContent}`
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `trend_data_${start.replace(/[/:]/g, '-')}_${end.replace(/[/:]/g, '-')}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 关闭抽屉
const onClose = () => {
  emit('update:isShow', false)
}

const onUpdateShow = (show: boolean) => {
  if (!show) {
    emit('update:isShow', false)
  }
}

// 监听显示状态
watch(() => props.isShow, async (show) => {
  if (show) {
    console.log('TrendDrawerModal: show')
    initTimeRange()
    await nextTick()
    // 先获取数据，再初始化图表
    const mockData = generateMockData()
    chartData.value = mockData
    initChart()
  } else {
    // 销毁图表实例
    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }
    window.removeEventListener('resize', handleResize)
  }
}, {immediate: true})

onMounted(() => {
  if (props.isShow) {
    initTimeRange()
  }
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(102, 102, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(75, 0, 130, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0;
  }

  &-title {
    @include fetch-theme-custom('color', 'modal-font-color');
    font-size: 22px;
    font-style: normal;
    font-weight: 700;
    letter-spacing: 1px;
    color: #fff;
    text-shadow: 0 0 20px rgba(102, 102, 255, 0.5);
  }

  &-close {
    cursor: pointer;
    color: #888;
    transition: all 0.3s ease;
    padding: 8px;
    border-radius: 8px;

    &:hover {
      color: #fff;
      background: rgba(102, 102, 255, 0.2);
      transform: scale(1.1);
    }
  }

  &-content {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    z-index: 1;
  }

  &-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    background: rgba(15, 15, 26, 0.9);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(102, 102, 255, 0.1);
    position: relative;
    z-index: 1;
  }

  &-button {
    width: 100px;
    height: 38px;
    border-radius: 10px;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    cursor: pointer;

    &.primary {
      background: linear-gradient(135deg, #6666FF 0%, #9966FF 50%, #6699FF 100%);
      color: #fff;
      box-shadow: 
        0 4px 15px rgba(102, 102, 255, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      
      &:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 
          0 8px 25px rgba(102, 102, 255, 0.5),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }

      &:active {
        transform: translateY(0) scale(0.98);
      }
    }

    &:not(.primary) {
      background: rgba(102, 102, 255, 0.1);
      color: #a8a8ff;
      border: 1px solid rgba(102, 102, 255, 0.3);
      
      &:hover {
        background: rgba(102, 102, 255, 0.2);
        border-color: rgba(102, 102, 255, 0.5);
        box-shadow: 0 0 20px rgba(102, 102, 255, 0.2);
      }
    }
  }
}

.time-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(36, 36, 66, 0.8) 100%);
  border-radius: 14px;
  border: 1px solid rgba(102, 102, 255, 0.15);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(8px);

  .time-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .time-range {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    flex: 1;
  }

  .time-separator {
    color: #888;
    font-size: 14px;
    padding: 0 4px;
  }

  .action-button {
    flex-shrink: 0;
  }

  .quick-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 8px;
    border-top: 1px solid rgba(102, 102, 255, 0.1);
  }

  .quick-select {
    display: flex;
    gap: 4px;
  }
}

.action-button {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  background: rgba(102, 102, 255, 0.12);
  color: #9999FF;
  border: 1px solid rgba(102, 102, 255, 0.25);
  cursor: pointer;

  &:hover {
    background: rgba(102, 102, 255, 0.2);
  }
}

.chart-container {
  flex: 1;
  min-height: 300px;
  background: rgba(26, 26, 46, 0.6);
  border-radius: 20px;
  border: 1px solid rgba(102, 102, 255, 0.2);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  overflow: hidden;
  backdrop-filter: blur(10px);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(102, 102, 255, 0.5), transparent);
  }
}

.data-summary {
  display: flex;
  justify-content: space-around;
  padding: 24px;
  background: rgba(26, 26, 46, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(102, 102, 255, 0.15);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);

  .summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 16px 24px;
    background: linear-gradient(135deg, rgba(102, 102, 255, 0.1) 0%, rgba(136, 136, 255, 0.05) 100%);
    border-radius: 12px;
    border: 1px solid rgba(102, 102, 255, 0.2);
    min-width: 100px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #6666FF, #9966FF, #6699FF);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    &:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 
        0 12px 30px rgba(102, 102, 255, 0.3),
        0 0 20px rgba(102, 102, 255, 0.1);
      border-color: rgba(102, 102, 255, 0.4);

      &::before {
        transform: scaleX(1);
      }
    }

    .summary-label {
      font-size: 11px;
      color: #888;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    .summary-value {
      font-size: 26px;
      font-weight: 800;
      background: linear-gradient(135deg, #8888FF 0%, #aaaaff 50%, #ccccff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 0 30px rgba(136, 136, 255, 0.3);
    }
  }
}

.default-content {
  @include fetch-theme-custom('color', 'modal-font-color');
  font-size: 14px;
  line-height: 1.8;
}


:deep(.n-drawer-header__main) {
  width: 100% !important;
}

:deep(.n-drawer-content) {
  height: 100vh !important;
  max-height: 100vh !important;
  overflow: hidden !important;
}

:deep(.n-drawer-body) {
  height: 100% !important;
  padding: 0 !important;
  overflow: hidden !important;
}

/* 暗色主题已作为默认主题 */
</style>