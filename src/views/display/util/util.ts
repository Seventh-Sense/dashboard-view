import type { ECharts, ComposeOption } from 'echarts/core'
import type { BarSeriesOption, LineSeriesOption } from 'echarts/charts'
import type { TitleComponentOption, GridComponentOption } from 'echarts/components'
import { InjectionKey } from 'vue'
import { number } from 'echarts'

export type ECOption = ComposeOption<
  BarSeriesOption | LineSeriesOption | TitleComponentOption | GridComponentOption
>

export interface Presentation {
  tradition: Tradition
  ai: AI
  other: Other
}

export interface Tradition {
  mode: Array<number>
  setTemp: number
  fanSpeed: number
}

export interface AI {
  people: number
  setTemp: number
  area: number
  preference: Array<number>
}

export interface Other {
  ominTemp: number
  omaxTemp: number
  irealTemp: number
}

export interface DataItem {
  name: string
  value: [string, number]
}

export interface Methods {
  submit: () => void
  reset: () => void
}

export const MY_FUNCTIONS_KEY = Symbol() as InjectionKey<Methods>

export const PresentationData = {
  tradition: {
    mode: [0, 0, 0, 1],
    setTemp: 25.5,
    fanSpeed: 3
  },
  ai: {
    people: 2,
    setTemp: 23,
    area: 25,
    preference: [0, 0, 1]
  },
  other: {
    ominTemp: 10,
    omaxTemp: 20,
    irealTemp: 25.5
  }
}

const handlePrefer = (arr: Array<number>) => {
  if (arr.length === 3) {
    const [first, second, third] = arr

    if (first === 1) return -1
    if (second === 1) return 0
    if (third === 1) return 1
  }

  return 1
}

//数据封装
export const dataEncap = (data: Presentation) => {
  return (
    'start,' +
    data.other.ominTemp +
    ',' +
    data.other.omaxTemp +
    ',' +
    data.ai.setTemp +
    ',' +
    data.ai.area +
    ',' +
    data.ai.people +
    ',' +
    handlePrefer(data.ai.preference)
  )
}

export const inputDataEncap = (start_time: any) => {
  let end_time = new Date().getTime()

  return [
    {
      device_id: 'aidevice001',
      metric_id: 'temperature',
      start_time: start_time,
      end_time: end_time
    },
    {
      device_id: 'aidevice001',
      metric_id: 'energy',
      start_time: start_time,
      end_time: end_time
    }
  ]
}

export const ParseData = (data: Array<any>) => {
  let result: any = {
    regular_temp: [],
    ai_temp: [],
    regular_energy: [],
    ai_energy: []
  }

  const metrics = ['temperature', 'energy'] as const

  data.forEach((item: any) => {
    if (item.metric_id === 'temperature') {
      item.points.forEach((point: any) => {
        let timestamp = point.timestamp
        let regular_temp = point.value.split(',')[0]
        let ai_temp = point.value.split(',')[1]
        result.regular_temp.push([ timestamp, parseFloat(regular_temp) ])
        result.ai_temp.push([ timestamp, parseFloat(ai_temp) ])
      })
      
    }

    if (item.metric_id === 'energy') {
      item.points.forEach((point: any) => {
        let timestamp = point.timestamp
        let regular_energy = point.value.split(',')[0]
        let ai_energy = point.value.split(',')[1]
        result.regular_energy.push([ timestamp, parseFloat(regular_energy) ])
        result.ai_energy.push([ timestamp, parseFloat(ai_energy) ])
      })
    }

    
  })

  return result
}

const translateArray = (arr: Array<any>) => {
  let array: any = []

  arr.forEach((item: any) => {
    array.push([item.timestamp, item.value])
  })

  return array
}

export function generateNextDateTime(prevDateTime?: string): string {
  // 确定当前时间：如果有参数则解析，否则用当前时间
  const currentDate = prevDateTime ? parseDateTimeString(prevDateTime) : new Date()

  // 增加5分钟
  currentDate.setMinutes(currentDate.getMinutes() + 5)

  // 格式化为目标字符串
  return formatDateToString(currentDate)
}

// 解析 YYYY-MM-DD HH:MM 字符串为 Date 对象
export function parseDateTimeString(datetimeStr: string): Date {
  // 去除非数字字符（兼容无分隔符的意外情况）
  const cleaned = datetimeStr.replace(/\D/g, '')

  // 提取各时间部分
  const year = parseInt(cleaned.substring(0, 4))
  const month = parseInt(cleaned.substring(4, 6)) - 1 // 月份从0开始
  const day = parseInt(cleaned.substring(6, 8))
  const hours = parseInt(cleaned.substring(8, 10))
  const minutes = parseInt(cleaned.substring(10, 12))

  return new Date(year, month, day, hours, minutes)
}

// 格式化 Date 为 YYYY-MM-DD HH:MM
export function formatDateToString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 补零
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

export function generateRandomTemperature(
  min: number = 0,
  max: number = 35,
  decimalPlaces: number = 1
): number {
  // 确保 min 和 max 顺序正确
  const [actualMin, actualMax] = min > max ? [max, min] : [min, max]

  // 生成原始随机值
  const randomValue = Math.random() * (actualMax - actualMin) + actualMin

  // 处理小数位数（非负整数校验）
  const factor = 10 ** Math.max(0, Math.floor(decimalPlaces))

  // 四舍五入并返回结果
  return Math.round(randomValue * factor) / factor
}

export const x = [
  0.0, 0.02, 0.03, 0.05, 0.07, 0.08, 0.1, 0.12, 0.13, 0.15, 0.17, 0.18, 0.2, 0.22, 0.23, 0.25, 0.27,
  0.28, 0.3, 0.32, 0.33, 0.35, 0.37, 0.38, 0.4, 0.42, 0.43, 0.45, 0.47, 0.48, 0.5, 0.52, 0.53, 0.55,
  0.57, 0.58, 0.6, 0.62, 0.63, 0.65, 0.67, 0.68, 0.7, 0.72, 0.73, 0.75, 0.77, 0.78, 0.8, 0.82, 0.83,
  0.85, 0.87, 0.88, 0.9, 0.92, 0.93, 0.95, 0.97, 0.98
]

export const y1 = [
  22.74, 23.12, 23.22, 23.3, 23.29, 23.24, 23.17, 23.1, 23.04, 23.0, 22.97, 22.96, 22.97, 22.98,
  22.98, 22.99, 22.99, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0,
  23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0,
  23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0, 23.0
]

export const y2 = [
  22.08, 22.35, 22.59, 22.62, 22.6, 22.54, 22.46, 22.39, 22.34, 22.31, 22.3, 22.3, 22.3, 22.3,
  22.31, 22.32, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33,
  22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33,
  22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33, 22.33,
  22.33, 22.33, 22.33, 22.33
]

export const mergeArrays = (arr1: any, arr2: any) => {
  if (arr1.length !== arr2.length) throw new Error('数组长度不一致')
  return arr1.map((element: any, index: any) => {
    return [element, arr2[index]]
  })
}

export const newA = mergeArrays(x, y1)
export const newB = mergeArrays(x, y2)

export const xa = [0.0, 0.0025, 0.005]

export const array1 = [22.74, 25.54, 28.74]

export const array2 = [22.74, 26.74, 28.74]
