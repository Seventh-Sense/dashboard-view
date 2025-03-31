<template>
  <div class="page" style="color: white">
    <div class="page-header">
      <div class="page-header-title">传统 VS AI</div>
    </div>
    <div class="page-container">
      <n-grid x-gap="14" :cols="12" style="margin-bottom: 14px">
        <n-gi :span="5" class="page-container-card filter-height">
          <TraditionSet :data="PresentData.tradition" @modMode="modMode" />
        </n-gi>
        <n-gi :span="4" class="page-container-card filter-height back">
          <AISet :data="PresentData.ai" @modPrefer="modPrefer" />
        </n-gi>
        <n-gi :span="3" class="page-container-card filter-height">
          <OtherSet :data="PresentData.other" />
        </n-gi>
      </n-grid>

      <n-grid x-gap="14" :cols="2">
        <n-gi class="page-container-card chart-height">
          <TemperatureChart :data="TempData" />
          <!-- <LineChart :data="TempData"/> -->
        </n-gi>
        <n-gi class="page-container-card chart-height">
          <EnergyChart :data="EnergyData" />
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, reactive, ref } from 'vue'
import { TemperatureChart } from './TemperatureChart/index'
import { EnergyChart } from './EnergyChart/index'
import {
  MY_FUNCTIONS_KEY,
  ParseData,
  Presentation,
  PresentationData,
  inputDataEncap,
  dataEncap
} from './util/util'
import { TraditionSet } from './TraditionSet'
import { AISet } from './AISet'
import { OtherSet } from './OtherSet'
import { cloneDeep } from 'lodash-es'
import { sendParams, readChartData } from '@/api/http'
import { message } from 'ant-design-vue'
import { LineChart } from './G2/LineChart'

const PresentData = reactive<Presentation>(cloneDeep(PresentationData))

const startTime = ref(0)

let interval: number

const TempData = ref({
  regular_temp: [],
  ai_temp: []
})
const EnergyData = ref({
  regular_energy: [],
  ai_energy: []
})

const modMode = (index: number) => {
  let tmp = PresentData.tradition.mode
  tmp[index] = tmp[index] === 1 ? 0 : 1

  if (tmp[index] === 1) {
    PresentData.tradition.mode = [0, 0, 0, 0]
    PresentData.tradition.mode[index] = 1
  } else {
    PresentData.tradition.mode = tmp
  }
}

const modPrefer = (index: number) => {
  let tmp = PresentData.ai.preference

  tmp[index] = tmp[index] === 1 ? 0 : 1

  if (tmp[index] === 1) {
    PresentData.ai.preference = [0, 0, 0]
    PresentData.ai.preference[index] = 1
  } else {
    PresentData.ai.preference = tmp
  }
}

const submit = () => {
  //console.log(PresentData)
  window.clearInterval(interval)
  startTime.value = new Date().getTime()

  sendParams({
    device_id: 'aidevice001',
    params: {
      cmd: 'stop'
    }
  })
    .then((res: any) => {
      if (res.status === 'OK') {
        sendInitInfo()
      }
    })
    .catch((e: any) => {
      console.error('Init error:', e)
    })
}

const sendInitInfo = () => {
  sendParams({
    device_id: 'aidevice001',
    params: {
      cmd: dataEncap(PresentData)
    }
  })
    .then((res: any) => {
      if (res.status === 'OK') {
        message.success('开始模拟！')
        //console.log('send Params success')
        interval = window.setInterval(() => {
          readData()
        }, 3000)
      }
    })
    .catch((e: any) => {
      console.error('send Params error:', e)
      message.success('模拟失败！')
    })
}

const readData = () => {
  readChartData(inputDataEncap(startTime.value))
    .then((res: any) => {
      //console.log(res)
      if (res.status === 'OK') {
        let result = ParseData(res.points)
        console.log('readData:', result)
        TempData.value = {
          regular_temp: result.regular_temp,
          ai_temp: result.ai_temp
        }

        EnergyData.value = {
          regular_energy: result.regular_energy,
          ai_energy: result.ai_energy
        }
      }
    })
    .catch((e: any) => {
      console.error('send Params error:', e)
    })
}

const reset = () => {
  console.log(PresentationData)
  PresentData.tradition = cloneDeep(PresentationData.tradition)
  PresentData.ai = cloneDeep(PresentationData.ai)
  PresentData.other = cloneDeep(PresentationData.other)

  window.clearInterval(interval)
  //clear
  TempData.value = {
    regular_temp: [],
    ai_temp: []
  }

  EnergyData.value = {
    regular_energy: [],
    ai_energy: []
  }

  sendParams({
    device_id: 'aidevice001',
    params: {
      cmd: 'stop'
    }
  })
    .then((res: any) => {
      if (res.status === 'OK') {
        message.success('模拟已停止！')
      }
    })
    .catch((e: any) => {
      console.error('Init error:', e)
    })
}

provide(MY_FUNCTIONS_KEY, {
  submit,
  reset
})
</script>

<style lang="scss" scoped>
$card-first-height: 316px;
$card-two-height: calc(100vh - $card-first-height - 56px - 14px - 14px - 14px);

.page {
  padding: 0;
  height: 100vh;
  @include background-image('background-image-new');

  &-header {
    height: 56px;
    padding: 0 12px;
    background: rgba(0, 0, 0, 0.13);
    backdrop-filter: blur(30px);
    display: flex;
    align-items: center;

    &-title {
      font-weight: bold;
      font-size: 16px;
      color: #ffffff;
      line-height: 24px;
      text-align: left;
      font-style: normal;
    }
  }

  &-container {
    padding: 14px;

    &-card {
      background: #181621;
      border-radius: 12px;
      backdrop-filter: blur(16px);
    }
  }
}

.filter-height {
  height: $card-first-height;
}

.chart-height {
  height: $card-two-height;
}

.back {
  background-image: url('@/assets/show_background.svg');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
