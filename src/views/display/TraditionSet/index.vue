<template>
  <div class="card">
    <div class="card-title">空调设置</div>
    <div class="card-mode">
      <div class="card-bottom-title" style="margin-bottom: 14px">模式</div>
      <div class="card-mode-content">
        <div class="card-mode-content-item">
          <div class="card-mode-content-icon" @click="onClick(0)">
            <img
              v-if="data.mode[0] === 1"
              width="48"
              height="48"
              :src="SVG_ICON.card_icons.show_refresh"
            />
            <img v-else width="48" height="48" :src="SVG_ICON.card_icons.show_refresh_g" />
          </div>
          <div class="card-mode-content-label">自动</div>
        </div>
        <div class="card-mode-content-item">
          <div class="card-mode-content-icon" @click="onClick(1)">
            <img
              v-if="data.mode[1] === 1"
              width="48"
              height="48"
              :src="SVG_ICON.card_icons.show_sun"
            />
            <img v-else width="48" height="48" :src="SVG_ICON.card_icons.show_sun_g" />
          </div>
          <div class="card-mode-content-label">制热</div>
        </div>
        <div class="card-mode-content-item">
          <div class="card-mode-content-icon" @click="onClick(2)">
            <img
              v-if="data.mode[2] === 1"
              width="48"
              height="48"
              :src="SVG_ICON.card_icons.show_snow"
            />
            <img v-else width="48" height="48" :src="SVG_ICON.card_icons.show_snow_g" />
          </div>
          <div class="card-mode-content-label">制冷</div>
        </div>
        <div class="card-mode-content-item">
          <div class="card-mode-content-icon" @click="onClick(3)">
            <img
              v-if="data.mode[3] === 1"
              width="48"
              height="48"
              :src="SVG_ICON.card_icons.show_fan2"
            />
            <img v-else width="48" height="48" :src="SVG_ICON.card_icons.show_fan2_g" />
          </div>
          <div class="card-mode-content-label">吹风</div>
        </div>
      </div>
    </div>
    <div class="card-setting">
      <div class="card-bottom-title">设定温度</div>
      <n-input-number v-model:value="data.setTemp" button-placement="both" style="width: 45%">
        <template #suffix>℃</template>
      </n-input-number>
    </div>
    <div class="card-bottom">
      <div class="card-bottom-title">风速</div>
      <div class="card-bottom-slider">
        <div class="card-bottom-text" style="margin-right: 4px;">0</div>
        <n-slider v-model:value="data.fanSpeed" :min="0" :max="4" :step="1" :marks="marks" />
        <div class="card-bottom-text" style="margin-left: 4px;">4</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SVG_ICON from '@/svg/SVG_ICON'
import { ref } from 'vue'

const emit = defineEmits(['modMode'])
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const marks = {
  0: '0',
  1: '1',
  2: '2',
  3: '3',
  4: '4'
}

const onClick = (index: number) => {
  emit('modMode', index)
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

  &-mode {
    height: 158px;
    padding: 11px 2px 16px 2px;

    &-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      &-icon {
        width: 70px;
        height: 70px;
        background: rgba(255, 255, 255, 0.13);
        border: 1px solid rgba(255, 255, 255, 0.13);
        border-radius: 50%;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }

      &-label {
        font-weight: 400;
        font-size: 12px;
        color: #ffffff;
        line-height: 17px;
        text-align: center;
        font-style: normal;
      }
    }
  }

  &-setting {
    height: 56px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-bottom {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-title {
      font-weight: 400;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.53);
      line-height: 20px;
      text-align: left;
      font-style: normal;
    }

    &-slider {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 80%;
    }

    &-text {
      font-weight: 400;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.53);
      line-height: 17px;
      text-align: left;
      font-style: normal;
    }
  }
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

::v-deep(.n-slider-handle) {
  display: none;
}

::v-deep(.n-slider-rail__fill) {
  background: linear-gradient(270deg, #d6d6ff 0%, #6666ff 100%);
  border-radius: 4px !important;
}

::v-deep(.n-slider-rail) {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::v-deep(.n-slider-mark) {
  display: none;
}

::v-deep(.n-slider--with-mark) {
  margin: 0;
}

::v-deep(.n-slider-dots) {
  left: 2px !important;
}

::v-deep(.n-slider-dot) {
  display: none;
}

::v-deep(.n-slider-dot--active) {
  display: block;
  height: 4px !important;
  width: 4px !important;
  border: 0 !important;
  background-color: white !important;
}
</style>
