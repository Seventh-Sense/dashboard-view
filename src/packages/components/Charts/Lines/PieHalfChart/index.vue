<template>
  <v-chart :option="option" autoresize />
</template>

<script setup lang="ts">
import { getRandomInt } from '@/utils'
import { computed, onMounted, ref } from 'vue'
import VChart from 'vue-echarts'

const data = ref<any>([])
const names = ref(['一类(直接排放)', '二类(峰值排放)'])

onMounted(() => {
  madeData()
  window.setInterval(() => {
    madeData()
  }, 3000)
})

const madeData = () => {
  let tmp: any[] = []

  tmp = [
    {
      name: '一类(直接排放)',
      value: getRandomInt(0, 100),
      itemStyle: { color: 'rgba(40,39,97,1)' }
    },
    {
      name: '二类(峰值排放)',
      value: getRandomInt(0, 100),
      itemStyle: { color: 'rgba(5,123,129,1)' }
    }
  ]

  data.value = tmp
}

const option = computed(() => {
  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      icon: 'circle',
      bottom: '5%',
      left: 'center',
      itemWidth: 20,
      itemHeight: 20,
      itemGap: 20,
      data: ['一类(直接排放)', '二类(峰值排放)'],
      formatter: function (name: any) {
        const dataItem = data.value.find((item: any) => item.name === name)
        if (dataItem) {
          const percent = (
            (dataItem.value / (data.value[0].value + data.value[1].value)) *
            100
          ).toFixed(1)
          // 使用富文本样式
          return `{name|${name}}{value|${dataItem.value}}{percent|${percent}%}`
        }
        return name
      },
      textStyle: {
        rich: {
          name: {
            width:120,
            fontSize: 20,
            color: 'rgba(108,106,119,1)'
          },
          value: {
            width: 80,
            color: 'rgba(108,106,119,1)',
            fontSize: 20,
            align: 'right',
            padding: [0, 10, 0, 0]
          },
          percent: {
            width: 100,
            color: 'rgba(108,106,119,1)',
            fontSize: 20,
            align: 'right'
          }
        }
      }
    },

    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['60%', '90%'],
        center: ['50%', '70%'],
        // adjust the start and end angle
        startAngle: 180,
        endAngle: 360,
        label: {
          show: false
        },
        data: data.value
      }
    ]
  }
})
</script>

<style lang="scss" scoped></style>
