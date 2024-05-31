import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { VoltageChartConfig } from './index'
import { CreateComponentType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'

export const includes = []

const option = {
  backgroundColor: '#0E1327',
  dataset: 5,
  series: [
    {
      type: 'gauge',
      center: ['50%', '55%'],
      radius: '100%',
      min: 0,
      max: 10,
      startAngle: 210,
      endAngle: -30,
      splitNumber: 1,
      itemStyle: {
        color: '#FFAB91'
      },
      progress: {
        show: true,
        width: 30,
        roundCap: false,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#F76F83' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#6666FF' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        }
      },
      pointer: {
        show: false
      },
      axisLine: {
        show: true,
        roundCap: false,
        lineStyle: {
          width: 30,
          color: [
            // 表盘外部颜色
            [0, '#708090'],
            [1, '#708090']
          ]
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: true,
        rotate: -0,
        formatter: function (value: any) {
          return `{a|${value}}`
        },
        rich: {
          a: {
            align: 'center',
            fontSize: 54,
            color: '#ffffff',
            padding: [120, -60, 13, -60]
          }
        }
      },
      anchor: {
        show: false
      },
      title: {
        show: false
      },
      detail: {
        show: true,
        valueAnimation: true,
        width: '60%',
        lineHeight: 54,
        borderRadius: 8,
        offsetCenter: [0, 0],
        fontSize: 54,
        fontWeight: 'bolder',
        formatter: function (value: any) {
          return value.toFixed(1) + '\nV';
        },
        color: '#ffffff'
      },
      data: [
        {
          value: 15
        }
      ]
    }
  ]
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key: string = VoltageChartConfig.key
  public chartConfig = cloneDeep(VoltageChartConfig)
  // 图表配置项
  public option = echartOptionProfixHandle(option, includes)
}
