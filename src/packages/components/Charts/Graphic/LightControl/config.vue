<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem :name="t('dashboard.value')">
        <n-input v-model:value="optionData.dataset" size="small"></n-input>
      </SettingItem>
      <SettingItem></SettingItem>
      <SettingItem :name="t('dashboard.on_text')">
        <n-input v-model:value="optionData.on_text" type="text" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.on_value')">
        <n-input v-model:value="optionData.on_contant" type="text" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.picture')">
        <n-input
          v-model:value="optionData.on_url"
          :placeholder="t('dashboard.click_picture')"
          size="small"
          @click="handleFileChange('on')"
        ></n-input>
      </SettingItem>
      <SettingItem></SettingItem>
      <SettingItem :name="t('dashboard.off_text')">
        <n-input v-model:value="optionData.off_text" type="text" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.on_value')">
        <n-input v-model:value="optionData.off_contant" type="text" size="small"></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.picture')">
        <n-input
          v-model:value="optionData.off_url"
          :placeholder="t('dashboard.click_picture')"
          size="small"
          @click="handleFileChange('off')"
        ></n-input>
      </SettingItem>
      <SettingItem></SettingItem>
    </SettingItemBox>

    <SettingItemBox :name="t('dashboard.style')" :alone="false">
      <setting-item :name="t('dashboard.title')">
        <n-input v-model:value="optionData.top_title" size="small" />
      </setting-item>
      <SettingItem :name="t('dashboard.title_size')">
        <n-input-number v-model:value="optionData.top_title_size" :min="1" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.title_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.top_title_color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem></SettingItem>
      <SettingItem :name="t('dashboard.image_w')">
        <n-input-number v-model:value="optionData.image_w" :min="10" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.image_h')">
        <n-input-number v-model:value="optionData.image_h" :min="10" size="small" />
      </SettingItem>
      <setting-item :name="t('dashboard.text')">
        <n-input v-model:value="optionData.tip_content" size="small" />
      </setting-item>
      <SettingItem :name="t('dashboard.text_size')">
        <n-input-number v-model:value="optionData.tip_size" :min="1" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.text_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.tip_color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem></SettingItem>
      <SettingItem :name="t('dashboard.switch_h')">
        <n-input-number v-model:value="optionData.switch_h" :min="1" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.switch_bg_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.switch_bg_color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.on_text_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.active_color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.on_bg_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.active_bg_color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.off_text_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.inactive_color"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.off_bg_color')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.inactive_bg_color"
        ></n-color-picker>
      </SettingItem>
    </SettingItemBox>
  </CollapseItem>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { option } from './config'
import { FileTypeEnum } from '@/enums/fileTypeEnum'
import { backgroundImageSize } from '@/settings/designSetting'

const t = window['$t']

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

type UploadCompletedEventType = {
  fileName: string
  url: string
}

const uploadFile = (callback: Function | null = null) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.png,.jpg,.jpeg,.gif' // 这里只允许部分图片类型
  input.onchange = async () => {
    if (!input.files || !input.files.length) return
    const file = input.files[0]
    const { name, size, type } = file
    if (size > 1024 * 1024 * backgroundImageSize) {
      window['$message'].warning(t('dashboard.upload_msg_err'))
      return false
    }
    if (type !== FileTypeEnum.PNG && type !== FileTypeEnum.JPEG && type !== FileTypeEnum.GIF) {
      window['$message'].warning(t('dashboard.upload_msg_err1'))
      return false
    }
    const reader = new FileReader()
    reader.onload = () => {
      const eventObj: UploadCompletedEventType = { fileName: name, url: reader.result as string }
      callback && callback(eventObj)
    }
    reader.readAsDataURL(file)
  }
  input.click()
}

const handleFileChange = (key: string) => {
  // 处理文件上传逻辑

  uploadFile((e: UploadCompletedEventType) => {
    if (key === 'on') {
      props.optionData.on_url = e.url
    } else if (key === 'off') {
      props.optionData.off_url = e.url
    }
  })
}
</script>

<style lang="scss" scoped></style>
