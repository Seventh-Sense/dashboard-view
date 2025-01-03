export interface deviceDataType {
  id: string
  name: string
  type: string
  polling?: string
  address?: string
  status?: string
  enabled?: string
  property?: null | any
}

export interface tagDataType {
  name: string
  address: string
  device: string
  type: string
  value: string
  timestamp: string
  description: string
}

export interface DataType {
  id: string
  name: string
  type: string
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

export const TypeOptions = [
  {
    label: 'BACnet',
    value: 'BACnet'
  },
  {
    label: 'ModbusRTU',
    value: 'ModbusRTU'
  },
  {
    label: 'ModbusTCP',
    value: 'ModbusTCP'
  },
  {
    label: 'EthernetIP',
    value: 'EthernetIP'
  }
]

export const ModbusRTUData = {
  connectionOption: 'Serial Port',
  baudrate: 115200,
  data_bit: 8,
  stop_bit: 1,
  parity: 'None'
}

export const BACnetData = {
  interface: '127.0.0.1',
  port: '47808',
  broadcast: '127.0.0.255',
  adpuTimeout: '6000'
}

export const connectionOptions = ['Serial Port'].map(v => ({
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

export const parityOptions = ['None', 'Odd', 'Even'].map(v => ({
  label: v,
  value: v
}))

export const stopbitOptions = [1, 2].map(v => ({
  label: v,
  value: v
}))