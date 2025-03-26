<template>
  <div class="card">
    <div class="card-title">AI模式</div>
    <div class="card-item">
      <div class="card-item-title">室外最低温度</div>
      <n-input-number v-model:value="data.ominTemp" button-placement="both" style="width: 60%">
        <template #suffix>℃</template>
      </n-input-number>
    </div>
    <div class="card-item">
      <div class="card-item-title">室外最高温度</div>
      <n-input-number v-model:value="data.omaxTemp" button-placement="both" style="width: 60%">
        <template #suffix>℃</template>
      </n-input-number>
    </div>
    <div class="card-item">
      <div class="card-item-title">当前室内实时温度</div>
      <n-input-number v-model:value="data.irealTemp" button-placement="both" style="width: 60%">
        <template #suffix>℃</template>
      </n-input-number>
    </div>
    <div class="card-buttons">
      <n-grid x-gap="8" :cols="2">
        <n-gi>
          <div class="card-buttons-button reset-button" @click="onReset">重置</div>
        </n-gi>
        <n-gi>
          <div class="card-buttons-button start-button" @click="onClick">开始模拟</div>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { Methods, MY_FUNCTIONS_KEY } from '../util/util'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const myFunctions  = inject(MY_FUNCTIONS_KEY)


const onClick = () => {
  myFunctions?.submit()
}

const onReset = () => {
  myFunctions?.reset()
}
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;

  height: 100%;
  padding: 6px 12px 10px 12px;

  &-title {
    height: 40px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    color: #ffffff;
    line-height: 24px;
    text-align: left;
    font-style: normal;
  }

  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;

    &-title {
      font-weight: 400;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.53);
      line-height: 20px;
      text-align: left;
      font-style: normal;
    }
  }

  &-buttons {
    height: 68px;
    display: flex;
    align-items: end;

    &-button {
      height: 32px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
}

.reset-button {
  background: rgba(255, 255, 255, 0.13);
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.13);
}

.start-button {
  background: #6666ff;
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.13);
}

::v-deep(.n-input-wrapper) {
  background-color: #181621;
}

::v-deep(.n-input__input-el) {
  text-align: center;
  border-bottom: 1px solid rgba(102, 102, 255, 1);
}

::v-deep(.n-input__prefix) {
  height: 34px;
  margin-right: 0;
  border-bottom: 1px solid rgba(102, 102, 255, 1);
}

::v-deep(.n-input__suffix) {
  height: 34px;
  margin-left: 0;
  border-bottom: 1px solid rgba(102, 102, 255, 1);
}
</style>
