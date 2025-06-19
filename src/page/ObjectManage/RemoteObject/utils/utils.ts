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
  address: number
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
  13: TypeEnum.MI,
  14: TypeEnum.MO,
  15: TypeEnum.Notification,
  17: TypeEnum.Schedule,
  19: TypeEnum.MV,
  20: TypeEnum.TrendLog,
  23: TypeEnum.Accumulator,
  56: TypeEnum.NetworkPort
}

// export function getDeviceTypeName(key: number): string {
//   return DEVICE_TYPE_MAP[key] ?? String(key);
// }

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
  ModbusRTU = 'ModbusRTU',
  ModbusTCP = 'ModbusTCP'
}

export const TypeOptions = [
  {
    label: 'BACnet',
    value: DeviceTypeEnum.BACnet
  },
  {
    label: 'ModbusRTU',
    value: DeviceTypeEnum.ModbusRTU
  },
  {
    label: 'ModbusTCP',
    value: 'ModbusTCP'
  }
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

export const ModbusTCPData = {
  slaveid: 1,
  host: '127.0.0.1',
  port: 5020,
  connectionOption: 'tcp'
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
    label: '01 Coils',
    value: '01'
  },
  {
    label: '02 Discrete Input',
    value: '02'
  },
  {
    label: '03 Holding Register',
    value: '03'
  },
  {
    label: '04 Input Register',
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

/**
 * 校验输入字符串是否为有效的非负整数（0-255）或整数范围（0-255）
 * @param value 输入字符串
 * @returns 校验结果 (true: 有效, false: 无效)
 */
export const validateIntegerOrRange = (value: string): boolean => {
  // 移除字符串两端空格
  const trimmedValue = value.trim()

  // 情况1：单个整数校验（必须 ≥0 且 ≤65535 的整数）
  if (!trimmedValue.includes('-')) {
    // 使用正则验证整数格式
    if (!/^\d+$/.test(trimmedValue)) return false
    const num = parseInt(trimmedValue, 10)
    return num >= 0 && num <= 65535
  }

  // 情况2：范围格式校验（必须满足 X-Y 格式）
  const parts = trimmedValue.split('-')
  if (parts.length !== 2) return false

  const [startStr, endStr] = parts.map(s => s.trim())

  // 验证两个部分都是整数
  if (!/^\d+$/.test(startStr) || !/^\d+$/.test(endStr)) return false

  const start = parseInt(startStr, 10)
  const end = parseInt(endStr, 10)

  // 范围值校验（必须满足 0≤start≤end≤65535）
  return start >= 0 && end >= 0 && start <= end && end <= 65535
}

// 创建配置映射表，便于扩展和维护

const getLabelByValue = (value: any, options: any[]) => {
  const option = options.find(opt => opt.value === value)
  return option?.label || value // 严格遵循找不到返回空字符串
}

const MODBUS_TEXT_MAPPER: Record<string, any[]> = {
  function: functionOptions,
  byteorder: OrderOptions,
  wordorder: OrderOptions,
  data_type: DatatypeOptions
}

export const modbusSelectTextMap = (key: any, value: any) => {
  if (MODBUS_TEXT_MAPPER[key]) {
    return getLabelByValue(value, MODBUS_TEXT_MAPPER[key])
  }
  return String(value)
}

export const modbusSelectOptions = (key: any) => {
  return MODBUS_TEXT_MAPPER[key] ? MODBUS_TEXT_MAPPER[key] : []
}

//通用字符串排序函数
export const sortByString = (a: string, b: string, emptyLast = false) => {
  // 空值处理
  if (a === null || a === undefined) return emptyLast ? 1 : -1
  if (b === null || b === undefined) return emptyLast ? -1 : 1

  // 中文排序使用 localeCompare
  return a.localeCompare(b, 'zh-CN')
}
