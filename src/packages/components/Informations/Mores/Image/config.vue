<template>
  <collapse-item :name="t('dashboard.effect')" :expanded="true">
    <SettingItemBox :name="t('dashboard.contant')">
      <SettingItem>
        <n-input v-model:value="optionData.datavalue" size="small"></n-input>
      </SettingItem>
    </SettingItemBox>
    <setting-item-box v-for="picture in optionData.pictures" :name="t('dashboard.picture')">
      <setting-item :name="t('dashboard.picture')">
        <n-input
          v-model:value="picture.url"
          :placeholder="t('dashboard.click_picture')"
          size="small"
          @click="handleFileChange(picture.key)"
        ></n-input>
      </setting-item>
      <setting-item :name="t('dashboard.value')">
        <n-input v-model:value="picture.value" size="small" />
      </setting-item>
      <setting-item v-if="picture.key !== 1">
        <n-icon size="18" color="white" @click="onDelete(picture.key)" style="cursor: pointer">
          <DeleteIcon />
        </n-icon>
      </setting-item>
    </setting-item-box>
    <div @click="add" class="btn">
      <n-icon size="18" color="white">
        <AddIcon />
      </n-icon>
    </div>
    <setting-item-box :name="t('dashboard.style')">
      <setting-item :name="t('dashboard.type')">
        <n-select v-model:value="optionData.fit" size="small" :options="fitList"></n-select>
      </setting-item>
      <setting-item :name="t('dashboard.radius')">
        <n-input-number
          v-model:value="optionData.borderRadius"
          size="small"
          :min="0"
          :placeholder="t('dashboard.radius')"
        ></n-input-number>
      </setting-item>
    </setting-item-box>
  </collapse-item>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { option } from './config'
import { FileTypeEnum } from '@/enums/fileTypeEnum'
import { backgroundImageSize } from '@/settings/designSetting'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { icon } from '@/plugins'

const { AddIcon } = icon.ionicons5
const { DeleteIcon } = icon.carbon

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

const t = window['$t']

// 适应类型
const fitList = [
  {
    value: 'fill',
    label: 'fill'
  },
  {
    value: 'contain',
    label: 'contain'
  },
  {
    value: 'cover',
    label: 'cover'
  },
  {
    value: 'scale-down',
    label: 'scale-down'
  },
  {
    value: 'none',
    label: 'none'
  }
]

const uploadFile = (callback: Function | null = null) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.png,.jpg,.jpeg,.gif' // 这里只允许部分图片类型
  input.onchange = async () => {
    if (!input.files || !input.files.length) return
    const file = input.files[0]
    const { name, size, type } = file
    if (size > 1024 * 1024 * backgroundImageSize) {
      window['$message'].warning(`图片超出 ${backgroundImageSize}M 限制，请重新上传！`)
      return false
    }
    if (type !== FileTypeEnum.PNG && type !== FileTypeEnum.JPEG && type !== FileTypeEnum.GIF) {
      window['$message'].warning('文件格式不符合，请重新上传！')
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

const handleFileChange = (key: number) => {
  // 处理文件上传逻辑

  uploadFile((e: UploadCompletedEventType) => {
    props.optionData.pictures.forEach((item: any) => {
      if (item.key === key) {
        item.url = e.url
      }
    })
  })
}

const add = () => {
  props.optionData.pictures.push({
    key: new Date().getTime(),
    url: '',
    value: '0'
  })
}

const onDelete = (key: number) => {
  props.optionData.pictures = props.optionData.pictures.filter((item: any) => item.key !== key)
}
</script>

<style lang="scss" scoped>
.btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
  height: 32px;
  background-color: #409eff;
  color: white;
  border-radius: 4px;
  justify-content: center;
}
</style>
