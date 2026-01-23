<template>
  <div class="content">
    <div class="content-porperty">{{ $t('device.address') }} (opc.tcp://[server]:[port])</div>
    <n-input v-model:value="data.property.url" :disabled="isEdit" />
    <div class="content-porperty">{{ $t('device.security_policy') }}</div>
    <n-select
      v-model:value="data.property.security_policy"
      :options="SecurityPolicyOptions"
      :disabled="isEdit"
    />
    <div class="content-porperty">{{ $t('device.message_security_mode') }}</div>
    <n-select
      v-model:value="data.property.security_mode"
      :options="setOptions"
      :disabled="isEdit"
    />
    <div class="content-porperty">{{ $t('device.auth_type') }}</div>
    <n-select v-model:value="data.property.auth_mode" :options="ModeOptions" :disabled="isEdit" />
    <div v-if="data.property.auth_mode === 1">
      <div class="content-porperty" style="margin-top: 16px">{{ $t('device.user') }}</div>
      <n-input v-model:value="data.property.username" :disabled="isEdit" />
      <div class="content-porperty">{{ $t('device.password') }}</div>
      <n-input
        type="password"
        show-password-on="mousedown"
        v-model:value="data.property.password"
        :disabled="isEdit"
      />
    </div>

    <div class="content-porperty" style="margin-top: 16px">{{ $t('device.certificate') }}</div>
    <div class="content-file">
      <n-input v-model:value="props.data.property.user_cert_name" disabled />
      <Icon
        name="folderOpen"
        type="mono-line"
        :color="{ normal: designStore.darkTheme ?'#ffffff': '#000000' }"
        :size="24"
        @click="onUploadFile('certificate')"
      />
      <Icon
        name="delete"
        type="mono-line"
        :color="{ normal: designStore.darkTheme ?'#ffffff': '#000000' }"
        :size="24"
        @click="onDeleteFile('certificate')"
      />
    </div>

    <div class="content-porperty">{{ $t('device.private_key') }}</div>
    <div class="content-file">
      <n-input v-model:value="props.data.property.user_key_name" disabled />
      <Icon
        name="folderOpen"
        type="mono-line"
        :color="{ normal: designStore.darkTheme ?'#ffffff': '#000000' }"
        :size="24"
        @click="onUploadFile('private_key')"
      />
      <Icon
        name="delete"
        type="mono-line"
        :color="{ normal: designStore.darkTheme ?'#ffffff': '#000000' }"
        :size="24"
        @click="onDeleteFile('private_key')"
      />
    </div>
    <div class="content-porperty">{{ $t('device.cert_url') }}</div>
    <n-input v-model:value="data.property.cert_url" :disabled="isEdit" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { MessageSecurityOptions, SecurityPolicyOptions } from '../../utils/utils'
import { Icon } from '@/icon/index'
import { useDesignStore } from '@/store/modules/designStore/designStore'

const designStore = useDesignStore()

const props = defineProps({
  isEdit: {
    type: Boolean,
    required: false
  },
  data: {
    type: Object,
    required: true
  }
})

type UploadResult = {
  fileName: string
  url: string
  pureBase64: string
}

const disabled = ref(false)

//file
const certificate_name = ref('')
const private_key_name = ref('')

const t = window['$t']

const ModeOptions = [
  {
    label: t('device.anonymous'),
    value: 0
  },
  {
    label: t('device.account'),
    value: 1
  },
  {
    label: t('device.certificate'),
    value: 2
  }
]

//setting false
const setOptions = computed(() => {
  // 提取安全策略判断条件
  const isNoneSecurityPolicy =
    props.data.property.security_policy === 'http://opcfoundation.org/UA/SecurityPolicy#None'

  // 统一处理映射逻辑，通过条件判断确定禁用规则
  return MessageSecurityOptions.map(item => ({
    ...item, // 直接扩展原始属性，减少重复书写
    disabled: isNoneSecurityPolicy
      ? item.value !== 1 // 当安全策略为None时，禁用值不等于1的选项
      : item.value === 1 // 其他安全策略时，禁用值等于1的选项
  }))
})

const onDeleteFile = (type: string) => {
  if (type === 'certificate') {
    props.data.property.user_cert_name = ''
    certificate_name.value = ''
    props.data.property.user_cert = ''
  } else if (type === 'private_key') {
    props.data.property.user_key_name = ''
    private_key_name.value = ''
    props.data.property.user_key = ''
  }
}

const uploadFile = (callback: Function | null = null, ptype: string) => {
  const input = document.createElement('input')

  input.type = 'file'
  input.accept = '.*'

  input.onchange = async () => {
    if (!input.files || !input.files.length) return

    const file = input.files[0]

    const { name } = file

    if (ptype === 'private_key') {
      //console.log('Uploading certificate file:', name)
      if (!name.endsWith('.pem')) {
        window['$message'].warning(t('dashboard.upload_msg_err1'))
        return false
      }
    }

    const reader = new FileReader()

    reader.onload = () => {
      // 完整的DataURL，包含前缀
      const dataUrl = reader.result as string

      let pureBase64 = ''

      if (ptype === 'certificate') {
        // 提取纯Base64部分（移除data:xxx;base64,前缀）
        const base64Index = dataUrl.indexOf('base64,')
        pureBase64 = base64Index !== -1 ? dataUrl.substring(base64Index + 7) : ''
      } else {
        pureBase64 = dataUrl
      }

      const eventObj = {
        fileName: name,
        url: dataUrl, // 保留完整的DataURL
        pureBase64: pureBase64 // 新增：纯Base64编码内容
      }

      callback && callback(eventObj)
    }

    if (ptype === 'certificate') {
      reader.readAsDataURL(file)
    } else {
      //读取为二进制数据
      reader.readAsText(file)
    }
  }

  input.click()
}

const onUploadFile = (type: string) => {
  uploadFile((result: UploadResult) => {
    //console.log('file', result)
    if (type === 'certificate') {
      props.data.property.user_cert_name = result.fileName
      certificate_name.value = result.fileName
      props.data.property.user_cert = result.pureBase64
    } else if (type === 'private_key') {
      props.data.property.user_key_name = result.fileName
      private_key_name.value = result.fileName
      props.data.property.user_key = result.pureBase64
    }
  }, type)
}

watch(
  () => props.data.property.security_policy,
  newData => {
    props.data.property.security_mode = null
  }
)

watch(
  () => props.data.property.auth_mode,
  newData => {
    // if (newData === 0) {
    //   props.data.property.user_cert = ''
    //   props.data.property.user_key = ''
    //   props.data.property.cert_url = ''
    //   certificate_name.value = ''
    //   private_key_name.value = ''
    // }

    if (newData !== 1) {
      props.data.property.username = ''
      props.data.property.password = ''
    }
  }
)

watch(
  () => props.data,
  newData => {
    console.log('Data changed:', newData)
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss" scoped>
.content {
  margin-top: 0;
  margin-bottom: 32px;
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden;

  &-porperty {
    @include fetch-theme-custom('color', 'property-color');
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    margin-top: 22px;
  }

  &-file {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
