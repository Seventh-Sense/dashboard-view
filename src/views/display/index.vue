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
          <TemperatureChart />
        </n-gi>
        <n-gi class="page-container-card chart-height">
          <EnergyChart />
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, reactive } from 'vue'
import { TemperatureChart } from './TemperatureChart/index'
import { EnergyChart } from './EnergyChart/index'
import { MY_FUNCTIONS_KEY, Presentation, PresentationData } from './util/util'
import { TraditionSet } from './TraditionSet'
import { AISet } from './AISet'
import { OtherSet } from './OtherSet'
import { cloneDeep } from 'lodash-es'
import { sendParams } from '@/api/http'

const PresentData = reactive<Presentation>(cloneDeep(PresentationData))

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
  console.log(PresentData)
  let data = {}
  sendParams(data)
    .then(res => {
      console.log(res)
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
