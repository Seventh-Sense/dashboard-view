<template>
  <n-modal v-model:show="modelShowRef" :mask-closable="true" @afterLeave="closeHandle">
    <n-table class="model-content" :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>{{t('dashboard.function')}}</th>
          <!-- <th>Win 快捷键</th> -->
          <th>
            <n-space justify="space-between">
              <span> {{t('dashboard.shortcut_key')}} </span>
              <n-icon size="20" class="go-cursor-pointer" @click="closeHandle">
                <close-icon></close-icon>
              </n-icon>
            </n-space>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in shortcutKeyOptions" :key="index">
          <td>{{ item.label }}</td>
          <td>{{ item.win }}</td>
          <!-- <td v-if="item.macSource">{{ item.mac }}</td>
          <td v-else>
            <n-gradient-text :size="22">{{ item.mac.substr(0, 1) }}</n-gradient-text>
            + {{ item.mac.substr(3) }}
          </td> -->
        </tr>
      </tbody>
    </n-table>
  </n-modal>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { icon } from '@/plugins'
import { WinKeyboard, MacKeyboard } from '@/enums/editPageEnum'

const { CloseIcon } = icon.ionicons5
const modelShowRef = ref(false)

const emit = defineEmits(['update:modelShow'])
const t = window['$t']
const props = defineProps({
  modelShow: Boolean
})


watch(() => props.modelShow, (newValue) => {
  modelShowRef.value = newValue
})

// 快捷键
const shortcutKeyOptions = [
  {
    label: t('dashboard.drag_canvas'),
    win: `${WinKeyboard.SPACE.toUpperCase()} + 🖱️ `,
    mac: `${MacKeyboard.SPACE.toUpperCase()} + 🖱️ `,
    macSource: true
  },
  {
    label: t('dashboard.move_all'),
    win: `${WinKeyboard.CTRL.toUpperCase()} + ↑ / → / ↓ / ←`,
    mac: `${MacKeyboard.CTRL.toUpperCase()} + ↑ `
  },
  {
    label: t('dashboard.lock_'),
    win: `${WinKeyboard.CTRL.toUpperCase()} + L `,
    mac: `${MacKeyboard.CTRL.toUpperCase()} + L `
  },
  {
    label: t('dashboard.unlock_'),
    win: `${WinKeyboard.CTRL.toUpperCase()} + ${WinKeyboard.SHIFT.toUpperCase()}+ L `,
    mac: `${MacKeyboard.CTRL.toUpperCase()} + ${MacKeyboard.SHIFT.toUpperCase()} + L `
  },
  {
    label: t('dashboard.hide'),
    win: `${WinKeyboard.CTRL.toUpperCase()} + H `,
    mac: `${MacKeyboard.CTRL.toUpperCase()} + H `
  },
  // {
  //   label: '展示',
  //   win: `${WinKeyboard.CTRL.toUpperCase()} + ${WinKeyboard.SHIFT.toUpperCase()} + H `,
  //   mac: `${MacKeyboard.CTRL.toUpperCase()} + ${MacKeyboard.SHIFT.toUpperCase()} + H `
  // },
  {
    label: t('dashboard.del'),
    win: 'Delete'.toUpperCase(),
    mac: `${MacKeyboard.CTRL.toUpperCase()} + Backspace `
  },
  {
    label: t('dashboard.copy'),
    win: `${WinKeyboard.CTRL.toUpperCase()} + C `,
    mac: `${MacKeyboard.CTRL.toUpperCase()} + C `
  },
  {
    label: t('dashboard.cut'),
    win: `${WinKeyboard.CTRL.toUpperCase()} + X `,
    mac: `${MacKeyboard.CTRL.toUpperCase()} + X `
  },
  {
    label: t('dashboard.paste'),
    win: `${WinKeyboard.CTRL.toUpperCase()} + V `,
    mac: `${MacKeyboard.CTRL.toUpperCase()} + V `
  },
  {
    label: t('dashboard.recoil'),
    win: `${WinKeyboard.CTRL.toUpperCase()} + Z `,
    mac: `${MacKeyboard.CTRL.toUpperCase()} + Z `
  },
  {
    label: t('dashboard.advance'),
    win: `${WinKeyboard.CTRL.toUpperCase()} + ${WinKeyboard.SHIFT.toUpperCase()} + Z `,
    mac: `${MacKeyboard.CTRL.toUpperCase()} + ${MacKeyboard.SHIFT.toUpperCase()} + Z `
  },
  {
    label: t('dashboard.multiple_choices'),
    win: `${WinKeyboard.CTRL.toUpperCase()} + 🖱️ `,
    mac: `${MacKeyboard.CTRL_SOURCE_KEY.toUpperCase()} + 🖱️ `
  },
  {
    label: t('dashboard.create_groups'),
    win: `${WinKeyboard.CTRL.toUpperCase()} + G / 🖱️ `,
    mac: `${MacKeyboard.CTRL_SOURCE_KEY.toUpperCase()} + G / 🖱️`
  },
  {
    label: t('dashboard.cancel_groups'),
    win: `${WinKeyboard.CTRL.toUpperCase()} + ${WinKeyboard.SHIFT.toUpperCase()} + G `,
    mac: `${MacKeyboard.CTRL_SOURCE_KEY.toUpperCase()} + ${WinKeyboard.SHIFT.toUpperCase()} + G `
  }
]

const closeHandle = () => {
  emit('update:modelShow', false)
}
</script>

<style lang="scss" scoped>
.model-content {
  width: 50vw;
  padding-bottom: 20px;
  overflow: hidden;
  border-radius: 15px;
  td {
    padding: 5px 10px;
  }
}
</style>
