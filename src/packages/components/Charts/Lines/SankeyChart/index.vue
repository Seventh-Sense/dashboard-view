<template>
  <v-chart :option="option" autoresize />
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import { computed, onMounted, ref } from 'vue'
import { getRandomInt } from '@/utils'
import * as echarts from 'echarts'

const data = ref<any>([])

onMounted(() => {
  // 可以在这里获取数据
  madeData()
  window.setInterval(() => {
    madeData()
  }, 3000)
})

const madeData = () => {
  let tmp: any[] = []

  for (let i = 1; i < 37; i++) {
    tmp.push([i, getRandomInt(300, 500)])
  }

  data.value = tmp
}

const option = computed(() => {
  return {
    tooltip: {
      show: true,
      confine: true,
      appendToBody: true,
      trigger: 'item',
      triggerOn: 'mousemove',
      backgroundColor: '#2e3847',
      borderColor: '#475264',
      textStyle: {
        color: '#ccc'
      }
    },
    label: {
      fontSize: 10,
      position: 'top',
      color: '#999',
      distance: 2,
      align: 'left',
      formatter: (params: any) => {
        return params.data.show
      }
    },
    series: [
      {
        type: 'sankey',
        top: '5%',
        bottom: '2%',
        left: '5%',
        right: '10%',
        nodeGap: 20,
        nodeWidth: 10,
        draggable: false,
        data: [
          {
            name: '2',
            show: '电力',
            attribute: {
              itemColor: '#6666FF'
            },
            value: 290.64,
            carbonValue: 319.704,
            itemStyle: {
              color: '#6666FF'
            }
          },
          {
            name: '10038',
            show: 'Du电力',
            attribute: {
              itemColor: '#00CED1'
            },
            target: '10038',
            source: '2',
            sourceShow: '电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#00CED1'
            }
          },
          {
            name: '10039',
            show: '公司A',
            attribute: {
              itemColor: '#9457EB'
            },
            target: '10039',
            source: '10038',
            sourceShow: 'Du电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#9457EB'
            }
          },
          {
            name: '10040',
            show: '公司B',
            attribute: {
              itemColor: '#E9C335'
            },
            target: '10040',
            source: '10038',
            sourceShow: 'Du电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#E9C335'
            }
          },
          {
            name: '10041',
            show: '公司C',
            attribute: {
              itemColor: '#F76F83'
            },
            target: '10041',
            source: '10038',
            sourceShow: 'Du电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#F76F83'
            }
          },
          {
            name: '10042',
            show: '公司D',
            attribute: {
              itemColor: '#35E960'
            },
            target: '10042',
            source: '10038',
            sourceShow: 'Du电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#35E960'
            }
          },
          {
            name: '10043',
            show: 'Du冷机2',
            attribute: {
              itemColor: '#837DFF'
            },
            target: '10043',
            source: '10038',
            sourceShow: 'Du电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#837DFF'
            }
          },
          {
            name: '10044',
            show: 'Du冷',
            attribute: {
              itemColor: '#52F4F6'
            },
            target: '10044',
            source: '10038',
            sourceShow: 'Du电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#52F4F6'
            }
          },
          {
            name: '10004',
            show: '电力-wuyuan',
            attribute: {
              itemColor: '#AE6EFF'
            },
            target: '10004',
            source: '2',
            sourceShow: '电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#AE6EFF'
            }
          },
          {
            name: '10007',
            show: '空调WU',
            attribute: {
              itemColor: '#FFEA5E'
            },
            target: '10007',
            source: '10004',
            sourceShow: '电力-wuyuan',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FFEA5E'
            }
          },
          {
            name: '10005',
            show: 'A栋电梯',
            attribute: {
              itemColor: '#FF8DA0'
            },
            target: '10005',
            source: '10004',
            sourceShow: '电力-wuyuan',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF8DA0'
            }
          },
          {
            name: '10006',
            show: 'B栋电梯',
            attribute: {
              itemColor: '#6DFF87'
            },
            target: '10006',
            source: '10004',
            sourceShow: '电力-wuyuan',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#6DFF87'
            }
          },
          {
            name: '10008',
            show: '电梯WU',
            attribute: {
              itemColor: '#4650E5'
            },
            target: '10008',
            source: '10004',
            sourceShow: '电力-wuyuan',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#4650E5'
            }
          },
          {
            name: '10009',
            show: '照明WU',
            attribute: {
              itemColor: '#01A9AD'
            },
            target: '10009',
            source: '10004',
            sourceShow: '电力-wuyuan',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#01A9AD'
            }
          },
          {
            name: '10010',
            show: '房间照明A',
            attribute: {
              itemColor: '#7A40DE'
            },
            target: '10010',
            source: '10004',
            sourceShow: '电力-wuyuan',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#7A40DE'
            }
          },
          {
            name: '10011',
            show: '房间照明B',
            attribute: {
              itemColor: '#BF9D00'
            },
            target: '10011',
            source: '10004',
            sourceShow: '电力-wuyuan',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#BF9D00'
            }
          },
          {
            name: '8',
            show: '暖通空调用电',
            attribute: {
              itemColor: '#D54F67'
            },
            target: '8',
            source: '2',
            sourceShow: '电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#D54F67'
            }
          },
          {
            name: '13',
            show: '空气处理机组',
            attribute: {
              itemColor: '#00C039'
            },
            target: '13',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#00C039'
            }
          },
          {
            name: '10',
            show: '锅炉',
            attribute: {
              itemColor: '#FF6FD8'
            },
            target: '10',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF6FD8'
            }
          },
          {
            name: '9',
            show: '冷机',
            attribute: {
              itemColor: '#29FFB6'
            },
            target: '9',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#29FFB6'
            }
          },
          {
            name: '10012',
            show: '冷机WU',
            attribute: {
              itemColor: '#FF934F'
            },
            target: '10012',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF934F'
            }
          },
          {
            name: '11',
            show: '冷却塔',
            attribute: {
              itemColor: '#46A6FF'
            },
            target: '11',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#46A6FF'
            }
          },
          {
            name: '10013',
            show: '冷却塔WU',
            attribute: {
              itemColor: '#FFD56F'
            },
            target: '10013',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FFD56F'
            }
          },
          {
            name: '14',
            show: '送排风机',
            attribute: {
              itemColor: '#00FFCC'
            },
            target: '14',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#00FFCC'
            }
          },
          {
            name: '15',
            show: '风机盘管',
            attribute: {
              itemColor: '#FF5EAA'
            },
            target: '15',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF5EAA'
            }
          },
          {
            name: '16',
            show: '变频器',
            attribute: {
              itemColor: '#00A779'
            },
            target: '16',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#00A779'
            }
          },
          {
            name: '12',
            show: '水泵',
            attribute: {
              itemColor: '#FFA53D'
            },
            target: '12',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FFA53D'
            }
          },
          {
            name: '17',
            show: '工业用电',
            attribute: {
              itemColor: '#00A2FF'
            },
            target: '17',
            source: '2',
            sourceShow: '电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#00A2FF'
            }
          },
          {
            name: '22',
            show: '辅助设施',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '22',
            source: '17',
            sourceShow: '工业用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '20',
            show: '电动机',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '20',
            source: '17',
            sourceShow: '工业用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '10016',
            show: '电动机WU',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '10016',
            source: '17',
            sourceShow: '工业用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '21',
            show: '照明系统',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '21',
            source: '17',
            sourceShow: '工业用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '18',
            show: '机器设备',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '18',
            source: '17',
            sourceShow: '工业用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '19',
            show: '生产线',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '19',
            source: '17',
            sourceShow: '工业用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '3',
            show: '照明',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '3',
            source: '2',
            sourceShow: '电力',
            value: 30.24,
            carbonValue: 33.264,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '5',
            show: '公共区域照明',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '5',
            source: '3',
            sourceShow: '照明',
            value: 30.24,
            carbonValue: 33.264,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '7',
            show: '专用插座',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '7',
            source: '3',
            sourceShow: '照明',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '4',
            show: '一般照明',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '4',
            source: '3',
            sourceShow: '照明',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '10014',
            show: '一般照明WU',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '10014',
            source: '3',
            sourceShow: '照明',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '6',
            show: '景观照明',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '6',
            source: '3',
            sourceShow: '照明',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '10015',
            show: 'Du照明',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '10015',
            source: '3',
            sourceShow: '照明',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '23',
            show: '特殊用电',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '23',
            source: '2',
            sourceShow: '电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          }
        ],
        links: [
          {
            name: '2',
            show: '电力',
            attribute: {
              itemColor: '#6666FF'
            },
            value: 290.64,
            carbonValue: 319.704,
            itemStyle: {
              color: '#6666FF'
            }
          },
          {
            name: '10038',
            show: 'Du电力',
            attribute: {
              itemColor: '#00CED1'
            },
            target: '10038',
            source: '2',
            sourceShow: '电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#00CED1'
            }
          },
          {
            name: '10039',
            show: '公司A',
            attribute: {
              itemColor: '#9457EB'
            },
            target: '10039',
            source: '10038',
            sourceShow: 'Du电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#9457EB'
            }
          },
          {
            name: '10040',
            show: '公司B',
            attribute: {
              itemColor: '#E9C335'
            },
            target: '10040',
            source: '10038',
            sourceShow: 'Du电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#E9C335'
            }
          },
          {
            name: '10041',
            show: '公司C',
            attribute: {
              itemColor: '#F76F83'
            },
            target: '10041',
            source: '10038',
            sourceShow: 'Du电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#F76F83'
            }
          },
          {
            name: '10042',
            show: '公司D',
            attribute: {
              itemColor: '#35E960'
            },
            target: '10042',
            source: '10038',
            sourceShow: 'Du电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#35E960'
            }
          },
          {
            name: '10043',
            show: 'Du冷机2',
            attribute: {
              itemColor: '#837DFF'
            },
            target: '10043',
            source: '10038',
            sourceShow: 'Du电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#837DFF'
            }
          },
          {
            name: '10044',
            show: 'Du冷',
            attribute: {
              itemColor: '#52F4F6'
            },
            target: '10044',
            source: '10038',
            sourceShow: 'Du电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#52F4F6'
            }
          },
          {
            name: '10004',
            show: '电力-wuyuan',
            attribute: {
              itemColor: '#AE6EFF'
            },
            target: '10004',
            source: '2',
            sourceShow: '电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#AE6EFF'
            }
          },
          {
            name: '10007',
            show: '空调WU',
            attribute: {
              itemColor: '#FFEA5E'
            },
            target: '10007',
            source: '10004',
            sourceShow: '电力-wuyuan',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FFEA5E'
            }
          },
          {
            name: '10005',
            show: 'A栋电梯',
            attribute: {
              itemColor: '#FF8DA0'
            },
            target: '10005',
            source: '10004',
            sourceShow: '电力-wuyuan',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF8DA0'
            }
          },
          {
            name: '10006',
            show: 'B栋电梯',
            attribute: {
              itemColor: '#6DFF87'
            },
            target: '10006',
            source: '10004',
            sourceShow: '电力-wuyuan',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#6DFF87'
            }
          },
          {
            name: '10008',
            show: '电梯WU',
            attribute: {
              itemColor: '#4650E5'
            },
            target: '10008',
            source: '10004',
            sourceShow: '电力-wuyuan',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#4650E5'
            }
          },
          {
            name: '10009',
            show: '照明WU',
            attribute: {
              itemColor: '#01A9AD'
            },
            target: '10009',
            source: '10004',
            sourceShow: '电力-wuyuan',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#01A9AD'
            }
          },
          {
            name: '10010',
            show: '房间照明A',
            attribute: {
              itemColor: '#7A40DE'
            },
            target: '10010',
            source: '10004',
            sourceShow: '电力-wuyuan',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#7A40DE'
            }
          },
          {
            name: '10011',
            show: '房间照明B',
            attribute: {
              itemColor: '#BF9D00'
            },
            target: '10011',
            source: '10004',
            sourceShow: '电力-wuyuan',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#BF9D00'
            }
          },
          {
            name: '8',
            show: '暖通空调用电',
            attribute: {
              itemColor: '#D54F67'
            },
            target: '8',
            source: '2',
            sourceShow: '电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#D54F67'
            }
          },
          {
            name: '13',
            show: '空气处理机组',
            attribute: {
              itemColor: '#00C039'
            },
            target: '13',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#00C039'
            }
          },
          {
            name: '10',
            show: '锅炉',
            attribute: {
              itemColor: '#FF6FD8'
            },
            target: '10',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF6FD8'
            }
          },
          {
            name: '9',
            show: '冷机',
            attribute: {
              itemColor: '#29FFB6'
            },
            target: '9',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#29FFB6'
            }
          },
          {
            name: '10012',
            show: '冷机WU',
            attribute: {
              itemColor: '#FF934F'
            },
            target: '10012',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF934F'
            }
          },
          {
            name: '11',
            show: '冷却塔',
            attribute: {
              itemColor: '#46A6FF'
            },
            target: '11',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#46A6FF'
            }
          },
          {
            name: '10013',
            show: '冷却塔WU',
            attribute: {
              itemColor: '#FFD56F'
            },
            target: '10013',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FFD56F'
            }
          },
          {
            name: '14',
            show: '送排风机',
            attribute: {
              itemColor: '#00FFCC'
            },
            target: '14',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#00FFCC'
            }
          },
          {
            name: '15',
            show: '风机盘管',
            attribute: {
              itemColor: '#FF5EAA'
            },
            target: '15',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF5EAA'
            }
          },
          {
            name: '16',
            show: '变频器',
            attribute: {
              itemColor: '#00A779'
            },
            target: '16',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#00A779'
            }
          },
          {
            name: '12',
            show: '水泵',
            attribute: {
              itemColor: '#FFA53D'
            },
            target: '12',
            source: '8',
            sourceShow: '暖通空调用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FFA53D'
            }
          },
          {
            name: '17',
            show: '工业用电',
            attribute: {
              itemColor: '#00A2FF'
            },
            target: '17',
            source: '2',
            sourceShow: '电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#00A2FF'
            }
          },
          {
            name: '22',
            show: '辅助设施',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '22',
            source: '17',
            sourceShow: '工业用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '20',
            show: '电动机',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '20',
            source: '17',
            sourceShow: '工业用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '10016',
            show: '电动机WU',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '10016',
            source: '17',
            sourceShow: '工业用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '21',
            show: '照明系统',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '21',
            source: '17',
            sourceShow: '工业用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '18',
            show: '机器设备',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '18',
            source: '17',
            sourceShow: '工业用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '19',
            show: '生产线',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '19',
            source: '17',
            sourceShow: '工业用电',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '3',
            show: '照明',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '3',
            source: '2',
            sourceShow: '电力',
            value: 30.24,
            carbonValue: 33.264,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '5',
            show: '公共区域照明',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '5',
            source: '3',
            sourceShow: '照明',
            value: 30.24,
            carbonValue: 33.264,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '7',
            show: '专用插座',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '7',
            source: '3',
            sourceShow: '照明',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '4',
            show: '一般照明',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '4',
            source: '3',
            sourceShow: '照明',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '10014',
            show: '一般照明WU',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '10014',
            source: '3',
            sourceShow: '照明',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '6',
            show: '景观照明',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '6',
            source: '3',
            sourceShow: '照明',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '10015',
            show: 'Du照明',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '10015',
            source: '3',
            sourceShow: '照明',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          },
          {
            name: '23',
            show: '特殊用电',
            attribute: {
              itemColor: '#FF63EC'
            },
            target: '23',
            source: '2',
            sourceShow: '电力',
            value: 0,
            carbonValue: 0,
            itemStyle: {
              color: '#FF63EC'
            }
          }
        ],
        emphasis: {
          label: {
            show: true
          },
          lineStyle: {
            opacity: 0.5
          }
        },
        label: {
          fontSize: 10,
          lineHeight: 15,
          position: 'top',
          color: '#999',
          distance: 2,
          align: 'left',
          show: true
        },
        lineStyle: {
          opacity: 0.3,
          color: 'gradient',
          curveness: 0.7
        },
        itemStyle: {
          width: 10,
          borderWidth: 8,
          borderRadius: 8
        },
        z: 2,
        coordinateSystem: 'view',
        orient: 'horizontal',
        layoutIterations: 32,
        edgeLabel: {
          show: false,
          fontSize: 12
        },
        levels: [],
        nodeAlign: 'justify',
        select: {
          itemStyle: {
            borderColor: '#212121'
          }
        },
        animationEasing: 'linear',
        animationDuration: 1000
      }
    ]
  }
})
</script>

<style lang="scss" scoped></style>
