import merge from 'lodash/merge'
import pick from 'lodash/pick'
import { EchartsDataType } from '../index.d'
import { globalThemeJson } from '@/settings/chartThemes/index'
import type VChart from 'vue-echarts'
import { readIotPoints, updatePoint } from '@/api/http'
import i18n from '@/i18n/index'
import { ref, onUnmounted } from 'vue'
import { debounce } from 'lodash-es'
import { includes } from './../../views/chart/ContentConfigurations/components/CanvasPage/components/CreateColorRenderChart/lineOptions'

//动画闪烁时间
export const animationTime = 3000
//节流时间
export const throttleTime = 1000

/**
 * * 合并 color 和全局配置项
 * @param option 配置
 * @param themeSetting 设置
 * @param excludes 排除元素
 * @returns object
 */
export const mergeTheme = <T, U>(option: T, themeSetting: U, includes: string[]) => {
  return (option = merge({}, pick(themeSetting, includes), option))
}

/**
 * * ECharts option 统一前置处理
 * @param option
 * @return option
 */
export const echartOptionProfixHandle = (option: any, includes: string[]) => {
  option['backgroundColor'] = 'rgba(0,0,0,0)'
  return mergeTheme(option, globalThemeJson, includes)
}

/**
 * * 设置数据
 * @param option
 * @return option
 */
export const setData = (option: any, data: EchartsDataType) => {
  option.dataset = data
  return option
}

/**
 * * 配置公共 setOption 方法
 * @param instance
 * @param data
 */
export const setOption = <T extends typeof VChart | undefined, D>(instance: T, data: D) => {
  if (!instance) return
  const option = instance.getOption()
  option.dataset = null
  instance.setOption(data)
}

//枚举值点击循环取值
export const clickCyclicData = (value: string, options: string[]): string => {
  if (options.length === 0) return '' // 处理空数组情况

  const index = options.indexOf(value)
  if (index === -1) return options[0] // 未找到返回首项

  let nextIndex = index + 1

  // 核心逻辑调整：确保索引有效且符合业务规则
  nextIndex = nextIndex > options.length - 1 || nextIndex >= options.length ? 0 : nextIndex

  return options[nextIndex]
}

//数据处理
export const updateNodeData = async (bindInfo: any, data: any) => {
  if (!bindInfo.objectID) {
    window['$message'].warning(i18n.global.t('msg.gauge_msg_3'))
    return false
  }

  console.log('bindInfo', bindInfo)
  try {
    let response: any

    if (bindInfo.deviceType === 'bacnet') {
      // BACnet设备特殊处理
      response = await readIotPoints(bindInfo.deviceID, {
        function: 'write_property',
        parms: {
          address: bindInfo.deviceAddress,
          objid: bindInfo.objectUid,
          prop: 'present-value',
          value: data,
          priority: bindInfo.objectPriority
        }
      })
    } else {
      // 其他设备类型
      response = await updatePoint(bindInfo.objectID, { value: data })
    }

    // 统一处理响应
    if (response.status !== 'OK') {
      console.warn('Non-OK response status:', response.data)

      const warningMsg = response.data.includes('write-access-denied')
        ? i18n.global.t('msg.gauge_msg_4')
        : i18n.global.t('msg.gauge_msg_2')

      window['$message'].warning(warningMsg)
      return false
    }

    return true
  } catch (error) {
    // 统一错误处理
    console.warn('Update Node Data failed', error)
    window['$message'].error(i18n.global.t('msg.gauge_msg_2'))
    return false
  }
}
