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
    <n-radio-group
      v-model:value="data.property.auth_mode"
      name="radiogroup"
      style="margin-top: 22px"
      :disabled="isEdit"
    >
      <n-space>
        <n-radio v-for="mode in ModeOptions" :key="mode.value" :value="mode.value">
          {{ mode.label }}
        </n-radio>
      </n-space>
    </n-radio-group>
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
    <div v-else-if="data.property.auth_mode === 2">
      <div class="content-porperty" style="margin-top: 16px">{{ $t('device.certificate') }}</div>
      <div class="content-file">
        <n-input v-model:value="certificate_name" disabled />
        <Icon
          name="folderOpen"
          type="mono-line"
          :color="{ normal: '#ffffff' }"
          :size="24"
          @click="onUploadFile('certificate')"
        />
        <Icon
          name="delete"
          type="mono-line"
          :color="{ normal: '#ffffff' }"
          :size="24"
          @click="onDeleteFile('certificate')"
        />
      </div>

      <div class="content-porperty">{{ $t('device.private_key') }}</div>
      <div class="content-file">
        <n-input v-model:value="private_key_name" disabled />
        <Icon
          name="folderOpen"
          type="mono-line"
          :color="{ normal: '#ffffff' }"
          :size="24"
          @click="onUploadFile('private_key')"
        />
        <Icon
          name="delete"
          type="mono-line"
          :color="{ normal: '#ffffff' }"
          :size="24"
          @click="onDeleteFile('private_key')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { MessageSecurityOptions, SecurityPolicyOptions } from '../../utils/utils'
import { Icon } from '@/icon/index'

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

type UploadCompletedEventType = {
  fileName: string
  url: string
}

const disabled = ref(false)

//file
const certificate_name = ref('')
const private_key_name = ref('')

const t = window['$t']

const ModeOptions = [
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
  const isNoneSecurityPolicy = props.data.property.security_policy === 
    'http://opcfoundation.org/UA/SecurityPolicy#None';
  
  // 统一处理映射逻辑，通过条件判断确定禁用规则
  return MessageSecurityOptions.map(item => ({
    ...item, // 直接扩展原始属性，减少重复书写
    disabled: isNoneSecurityPolicy 
      ? item.value !== 1  // 当安全策略为None时，禁用值不等于1的选项
      : item.value === 1  // 其他安全策略时，禁用值等于1的选项
  }));
});

const onDeleteFile = (type: string) => {
  if (type === 'certificate') {
    certificate_name.value = ''
    props.data.property.user_cert = ''
  } else if (type === 'private_key') {
    private_key_name.value = ''
    props.data.property.user_key = ''
  }
}

const uploadFile = (callback: Function | null = null) => {
  const input = document.createElement('input')

  input.type = 'file'
  input.accept = '.*'

  input.onchange = async () => {
    if (!input.files || !input.files.length) return

    const file = input.files[0]

    const { name, size, type } = file

    const reader = new FileReader()

    reader.onload = () => {
      const eventObj: UploadCompletedEventType = { fileName: name, url: reader.result as string }
      callback && callback(eventObj)
    }
    reader.readAsDataURL(file)
  }

  input.click()
}

const onUploadFile = (type: string) => {
  uploadFile((e: UploadCompletedEventType) => {
    console.log('file', e)
    if (type === 'certificate') {
      certificate_name.value = e.fileName
      props.data.property.user_cert = e.url
    } else if (type === 'private_key') {
      private_key_name.value = e.fileName
      props.data.property.user_key = e.url
    }
  })
}

watch(
  () => props.data.property.security_policy,
  newData => {
    props.data.property.security_mode = null
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

  &-porperty {
    font-size: 12px;
    color: #{$--color-dark-modal-title};
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
