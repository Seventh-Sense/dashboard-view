<template>
  <div class="card">
    <div class="card-title">AI模式</div>
    <div class="card-item">
      <div class="card-item-title">设定人数</div>
      <n-input-number v-model:value="data.people" button-placement="both" style="width: 50%">
        <template #suffix>人</template>
      </n-input-number>
    </div>
    <div class="card-item">
      <div class="card-item-title">目标设定温度</div>
      <n-input-number v-model:value="data.setTemp" button-placement="both" style="width: 50%">
        <template #suffix>℃</template>
      </n-input-number>
    </div>
    <div class="card-item">
      <div class="card-item-title">面积</div>
      <n-input-number v-model:value="data.area" button-placement="both" style="width: 50%">
        <template #suffix>m²</template>
      </n-input-number>
    </div>
    <div class="card-item">
      <div class="card-item-title">偏好设置</div>
      <div class="card-groups">
        <div
          class="card-groups-item"
          :class="
            data.preference[0] === 1 ? 'card-groups-item-select' : 'card-groups-item-unselect'
          "
          @click="onClick(0)"
        >
          偏冷
        </div>
        <div
          class="card-groups-item"
          :class="
            data.preference[1] === 1 ? 'card-groups-item-select' : 'card-groups-item-unselect'
          "
          @click="onClick(1)"
        >
          正常
        </div>
        <div
          class="card-groups-item"
          :class="
            data.preference[2] === 1 ? 'card-groups-item-select' : 'card-groups-item-unselect'
          "
          @click="onClick(2)"
        >
          偏热
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits(['modPrefer'])
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const onClick = (index: number) => {
  emit('modPrefer', index)
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

  &-groups {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 60%;
    height: 32px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 16px;

    &-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 33%;
      height: 32px;
      border-radius: 16px;
      cursor: pointer;

      font-size: 16px;
      line-height: 24px;
      text-align: left;
      font-style: normal;

      &-unselect {
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
      }

      &-select {
        font-weight: bold;
        color: #ffffff;
        background-image: radial-gradient(ellipse at 50% 90%,#00ced1 0%,#6666ff 70%);
      }
    }
  }
}

::v-deep(.n-input) {
  background-color: transparent !important;
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
