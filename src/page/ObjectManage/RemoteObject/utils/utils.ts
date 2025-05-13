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
  0: 'AI',
  1: 'AO',
  2: 'AV',
  3: 'BI',
  4: 'BO',
  5: 'BV',
  6: 'Calendar',
  8: 'Device',
  15: 'Notification',
  17: 'Schedule',
  19: 'MV',
  20: 'TrendLog',
  56: 'NetworkPort'
}

export const PRIMARY_ORDER = [
  "object-name",
  "object-type",
  "object-identifier",
  "description",
] as const;

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
  adpuTimeout: 6000
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
