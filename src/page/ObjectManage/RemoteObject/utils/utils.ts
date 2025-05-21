import { TypeEnum } from './propertyMap'

export interface DeviceTableData {
  key: string
  device_id: string
  device_name?: string
  device_type: string
  polling: number
  address: string
  status: string
  enabled: boolean
  properties: any
  tags?: any
}

export interface tagDataType {
  id: string
  name: string
  address: string
  device: string
  type: string
  value: string
}

export interface PointData {
  key?: string
  metric_uid: string
  metric_id: string
  metric_type: number
  metric_name: string
  unit: string
  value: any
  description: string
  properties: any
  tags: string
  device_id: string
}

export interface DataType {
  id: string
  name: string
  type: string
  polling: number
  enabled: boolean
  property: null | any
}

export interface ModbusRTUType {
  connectionOption: string
  baudrate: number
  data_bit: number
  stop_bit: number
  parity: string
}

export interface ModbusTCPType {
  connectionOption: string
  socketReuse: string
  slaveIP: string
  slavePort: number
  parity: string
}

export interface BACnetType {
  interface: string
  port: number
  broadcast: string
  adpuTimeout: number
}

export const DEVICE_TYPE_MAP: { [key: number]: string } = {
  0: TypeEnum.AI,
  1: TypeEnum.AO,
  2: TypeEnum.AV,
  3: TypeEnum.BI,
  4: TypeEnum.BO,
  5: TypeEnum.BV,
  6: TypeEnum.Calendar,
  8: TypeEnum.Device,
  15: TypeEnum.Notification,
  17: TypeEnum.Schedule,
  19: TypeEnum.MV,
  20: TypeEnum.TrendLog,
  23: TypeEnum.Accumulator,
  56: TypeEnum.NetworkPort
}

export const PRIMARY_ORDER = [
  'object-name',
  'object-type',
  'object-identifier',
  'description'
] as const

export function isModbusRTU(x: any): x is ModbusRTUType {
  return (
    typeof x === 'object' &&
    x !== null &&
    typeof x.connectionOption === 'string' &&
    typeof x.baudrate === 'number' &&
    typeof x.data_bit === 'number' &&
    typeof x.stop_bit === 'number' &&
    typeof x.parity === 'string'
  )
}

export function isModbusTCP(x: any): x is ModbusTCPType {
  return (
    typeof x === 'object' &&
    x !== null &&
    typeof x.connectionOption === 'string' &&
    typeof x.socketReuse === 'string' &&
    typeof x.slaveIP === 'string' &&
    typeof x.slavePort === 'number' &&
    typeof x.parity === 'string'
  )
}

export function isBACnet(x: any): x is BACnetType {
  return (
    typeof x === 'object' &&
    x !== null &&
    typeof x.interface === 'string' &&
    typeof x.port === 'number' &&
    typeof x.broadcast === 'string' &&
    typeof x.adpuTimeout === 'number'
  )
}

export enum DeviceTypeEnum {
  BACnet = 'bacnet',
  ModbusRTU = 'ModbusRTU'
}

export const TypeOptions = [
  {
    label: 'BACnet',
    value: DeviceTypeEnum.BACnet
  },
  {
    label: 'ModbusRTU',
    value: DeviceTypeEnum.ModbusRTU
  }
  // {
  //   label: 'ModbusTCP',
  //   value: 'ModbusTCP'
  // },
  // {
  //   label: 'EthernetIP',
  //   value: 'EthernetIP'
  // }
]

export const ModbusRTUData = {
  slaveid: 1,
  connectionOption: 'SerialPort',
  port: '',
  baudrate: 9600,
  bytesize: 8,
  stopbits: 1,
  parity: 'N'
}

export const BACnetData = {
  interface: '127.0.0.1',
  port: '47808',
  broadcast: '127.0.0.255',
  adpuTimeout: 6000
}

export const connectionOptions = ['SerialPort'].map(v => ({
  label: v,
  value: v
}))

export const baudOptions = [
  300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 56000, 57600, 115200, 128000, 256000
].map(v => ({
  label: v,
  value: v
}))

export const databitOptions = [7, 8].map(v => ({
  label: v,
  value: v
}))

export const parityOptions = [
  {
    label: 'None',
    value: 'N'
  },
  {
    label: 'Odd',
    value: 'O'
  },
  {
    label: 'Even',
    value: 'E'
  }
]

export const stopbitOptions = [1, 2].map(v => ({
  label: v,
  value: v
}))

export function isEmptyObject(obj: object): obj is {} {
  return Object.keys(obj).length === 0
}

export const makeUpOptions = (data: []) => {
  return data.map(v => ({
    label: v,
    value: v
  }))
}

export const pollOptions = [
  {
    label: '200 ms',
    value: 0.2
  },
  {
    label: '350 ms',
    value: 0.35
  },
  {
    label: '500 ms',
    value: 0.5
  },
  {
    label: '700 ms',
    value: 0.7
  },
  {
    label: '1 sec',
    value: 1
  },
  {
    label: '1.5 sec',
    value: 1.5
  },
  {
    label: '2 sec',
    value: 2
  },
  {
    label: '3 sec',
    value: 3
  },
  {
    label: '4 sec',
    value: 4
  },
  {
    label: '5 sec',
    value: 5
  },
  {
    label: '10 sec',
    value: 10
  },
  {
    label: '30 sec',
    value: 30
  },
  {
    label: '1 min',
    value: 60
  }
]

export const functionOptions = [
  {
    label: 'ReadCoils',
    value: '01'
  },
  {
    label: 'ReadDiscreteInput',
    value: '02'
  },
  {
    label: 'ReadHoldingRegister',
    value: '03'
  },
  {
    label: 'ReadInputRegister',
    value: '04'
  }
]

export const OrderOptions = [
  {
    label: 'Little-endian mode',
    value: 0
  },
  {
    label: 'Big-end mode',
    value: 1
  }
]

export const DatatypeOptions = [
  'int8',
  'int16',
  'int32',
  'int64',
  'uint8',
  'uint16',
  'uint32',
  'uint64',
  'float16',
  'float32',
  'float64',
  'str',
  'string'
].map(v => ({
  label: v,
  value: v
}))

export function formatTimestamp(timestamp: any) {
  // 将时间戳转为毫秒并创建Date对象
  const date = new Date(timestamp * 1000)

  // 提取时间组成部分
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  // 组合成标准格式
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
