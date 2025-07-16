<template>
  <CollapseItem :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem :name="t('dashboard.value')">
        <n-input-number v-model:value="optionData.dataset" size="small"></n-input-number>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.switch')" :alone="false">
      <SettingItem :name="t('dashboard.width')">
        <n-input-number v-model:value="optionData.switch_w" :min="1" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.height')">
        <n-input-number v-model:value="optionData.switch_h" :min="1" size="small" />
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.picture')" :alone="false">
      <SettingItem :name="t('dashboard.width')">
        <n-input-number v-model:value="optionData.image_w" :min="1" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.height')">
        <n-input-number v-model:value="optionData.image_h" :min="1" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.on_image')">
        <n-input
          v-model:value="optionData.image_on"
          :placeholder="t('dashboard.click_picture')"
          size="small"
          @click="handleFileChange('on')"
        ></n-input>
      </SettingItem>
      <SettingItem :name="t('dashboard.off_image')">
        <n-input
          v-model:value="optionData.image_off"
          :placeholder="t('dashboard.click_picture')"
          size="small"
          @click="handleFileChange('off')"
        ></n-input>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox :name="t('dashboard.style')" :alone="false">
      <SettingItem :name="t('dashboard.background')">
        <n-color-picker
          size="small"
          :modes="['hex']"
          v-model:value="optionData.backgroundColor"
        ></n-color-picker>
      </SettingItem>
      <SettingItem :name="t('dashboard.radius')">
        <n-input-number v-model:value="optionData.radius" :min="0" size="small" />
      </SettingItem>
      <SettingItem :name="t('dashboard.filter')">
        <n-input-number v-model:value="optionData.filter" :min="0" size="small" />
      </SettingItem>
      <SettingItem></SettingItem>
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
    </SettingItemBox>
  </CollapseItem>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { option } from './config'
import { backgroundImageSize } from '@/settings/designSetting'
import { FileTypeEnum } from '@/enums/fileTypeEnum'

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
      props.optionData.image_on = e.url
    } else if (key === 'off') {
      props.optionData.image_off = e.url
    }
  })
}
</script>

<style lang="scss" scoped></style>
