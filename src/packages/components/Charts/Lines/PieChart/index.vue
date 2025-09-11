<template>
  <v-chart :option="option" autoresize />
</template>

<script setup lang="ts">
import { getRandomInt } from '@/utils'
import { computed, onMounted, ref } from 'vue'
import VChart from 'vue-echarts'

const data = ref<any>([])
const names = ref(['用电', '可回收物', '固体废弃物', '污水', '饮用水', '燃气'])

onMounted(() => {
  madeData()
  window.setInterval(() => {
    madeData()
  }, 3000)
})

const madeData = () => {
  let tmp: any[] = []
  names.value.forEach((name: string) => {
    tmp.push({
      name: name,
      value: getRandomInt(500, 1000)
    })
  })

  data.value = tmp
}

const option = computed(() => {
  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      right: '20%',
      top: 'center',
      orient: 'vertical',
      textStyle: {
        color: 'rgba(255,255,255,1)',
        
      }
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: ['60%', '70%'],
        center: ['28%', '50%'],
        avoidLabelOverlap: false,
        padAngle: 3,
        itemStyle: {
          borderRadius: 40
        },
        label: {
          show: false,
          position: 'center'
        },
        data: data.value
      }
    ]
  }
})
</script>

<style lang="scss" scoped></style>
