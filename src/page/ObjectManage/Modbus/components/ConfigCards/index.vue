<template>
  <n-card hoverable class="container">
    <div style="margin-bottom: 24px">
      <div class="link-style">Modbus 1</div>
      <LinkParams :data="data.modbus1" />
    </div>
    <div>
      <div class="link-style">Modbus 2</div>
      <LinkParams :data="data.modbus2" />
    </div>
    <div class="save-btn">
      <n-button type="info" @click="save">保存</n-button>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { LinkParams } from '../LinkParams'
import { ref, inject, onMounted, reactive } from 'vue'
import { createModbusConfig, readModbusConfig, writeModbusConfig } from '@/api/http'
import { JSONParse, JSONStringify } from '@/utils'

const data = reactive({
  modbus1: {
    id: '1',
    connect_mode: 'Serial Port',
    serial_port: '/dev/ttyS3',
    baudrate: 9600,
    data_bit: 8,
    parity: 'Even',
    stop_bit: 2,
    mode: 'RTU'
  },
  modbus2: {
    id: '2',
    connect_mode: 'Serial Port',
    serial_port: '/dev/ttyS4',
    baudrate: 9600,
    data_bit: 8,
    parity: 'Even',
    stop_bit: 2,
    mode: 'RTU'
  }
})

onMounted(() => {
  //init
  initData()
})

const initData = () => {
  readModbusConfig()
    .then((res: any) => {
      let result = res.find((item: any) => item.name === 'Modbus 1')
      if (result === undefined) {
        initCreate('Modbus 1', data.modbus1)
      } else {
        updateData('Modbus 1', result)
      }

      let result2 = res.find((item: any) => item.name === 'Modbus 2')
      if (result2 === undefined) {
        initCreate('Modbus 2', data.modbus2)
      } else {
        updateData('Modbus 2', result2)
      }
    })
    .catch(err => {
      console.log(err)
    })
}

const initCreate = (name: string, data: Object) => {
  createModbusConfig({
    name: name,
    settings: JSON.stringify(data)
  })
    .then((res: any) => {
      console.log('create' + name + 'success')
    })
    .catch(err => {
      console.log(err)
    })
}

const updateData = (name: string, res: any) => {
  let result = JSON.parse(res.settings)

  if (name === 'Modbus 1') {
    data.modbus1 = result
  }

  if (name === 'Modbus 2') {
    data.modbus2 = result
  }

  console.log(data)
}

const save = () => {
  // save Modbus 1
  writeModbusConfig(1, {
    name: 'Modbus 1',
    settings: JSON.stringify(data.modbus1)
  }).then(res => {
    console.log('modification Modbus 1 success')
    window['$message'].success('Data Success!')
  }).catch(err => {
    console.log(err)
  })

  writeModbusConfig(2, {
    name: 'Modbus 2',
    settings: JSON.stringify(data.modbus2)
  }).then(res => {
    console.log('modification Modbus 2 success')
  }).catch(err => {
    console.log(err)
  })
}
</script>

<style lang="scss" scoped>
.container {
  height: calc(100vh - 56px - 32px - 12px - 12px - 41px - 12px);
}

.link-style {
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 12px;
}

.save-btn {
  height: 48px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

// .auto-div {
//   flex-grow: 1; /* 自动扩展以占据剩余空间 */
// }</style>
