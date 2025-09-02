<template>
  <v-chart :option="option" autoresize />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'

const option = computed(() => {
  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'right'
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: ['60%', '70%'],
        avoidLabelOverlap: false,
        padAngle: 3,
        itemStyle: {
          borderRadius: 40
        },
        label: {
          show: false,
          position: 'center'
        },
        data: [
          { value: 1048, name: '用电' },
          { value: 735, name: '可回收物' },
          { value: 580, name: '固体废弃物' },
          { value: 484, name: '污水' },
          { value: 300, name: '饮用水' },
          { value: 300, name: '燃气' }
        ]
      }
    ]
  }
})
</script>

<style lang="scss" scoped></style>
