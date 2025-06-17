import { DEVICE_TYPE_MAP } from './utils'
import unitsJson from '@/assets/data/Units.json'
import { PropertyConstants } from './propertyID'

// 生成类型
type PropertyKeys = keyof typeof PropertyConstants
type PropertyValues = typeof PropertyConstants[PropertyKeys]

// 冻结对象并添加类型
export const PropertyMap = Object.freeze({
  ...PropertyConstants,
  getName(value: number): string | undefined {
    return (Object.keys(PropertyConstants) as PropertyKeys[]).find(
      key => PropertyConstants[key] === value
    )
  }
})

export const MODBUS_ID_MAP = (key: string) => {
  const t = window['$t']

  const ID_MAP: { [key: string]: string } = {
    name: t('device.name'),
    description: t('device.desc'),
    function: t('device.reg_type'),
    address: t('device.reg_attr'),
    count: t('device.reg_num'),
    data_type: t('device.data_type'),
    byteorder: t('device.byte_order'),
    wordorder: t('device.word_order'),
    divisor: t('device.coefficient'),
  }

  return ID_MAP[key] ? ID_MAP[key] : key
}

export const PROPERTY_TYPE_MAP = (key: string) => {
  const t = window['$t']

  const PROPERTY_MAP: { [key: string]: string } = {
    'object-name': t('device.object_name'),
    'object-type': t('device.type'),
    'object-identifier': t('device.id'),
    description: t('device.desc'),
    'event-state': t('device.event_state'),
    'out-of-service': t('device.out_of_service'),
    'present-value': t('device.present_value'),
    'status-flags': t('device.status_flags'),
    units: t('device.unit'),
    'priority-array': t('device.priority_array'),
    'relinquish-default': t('device.relinquish_default'),
    'current-command-priority': t('device.current_command_priority'),
    polarity: t('device.polarity'),
    'alarm-values': t('device.alarm_values'),
    'number-of-states': t('device.number_of_states'),
    'state-text': t('device.state_text'),
    priority: t('device.priority'),
    'inactive-text': t('device.inactive_text'),
    'active-text': t('device.active_text'),
    'apdu-segment-timeout': t('device.apdu_segment_timeout'),
    'apdu-timeout': t('device.apdu_timeout'),
    'application-software-version': t('device.application_software_version'),
    'database-revision': t('device.database_revision'),
    'firmware-revision': t('device.firmware_revision'),
    'max-apdu-length-accepted': t('device.max_apdu_length_accepted'),
    'model-name': t('device.model_name'),
    'number-of-apdu-retries': t('device.number_of_apdu_retries'),
    'protocol-revision': t('device.protocol_revision'),
    'protocol-version': t('device.protocol_version'),
    'segmentation-supported': t('device.segmentation_supported'),
    'system-status': t('device.system_status'),
    'vendor-identifier': t('device.vendor_identifier'),
    'vendor-name': t('device.vendor_name')
  }

  return PROPERTY_MAP[key] ? PROPERTY_MAP[key] : key
}

export enum TypeEnum {
  AI = 'Analog Input',
  AO = 'Analog Output',
  AV = 'Analog Value',
  BI = 'Binary Input',
  BO = 'Binary Output',
  BV = 'Binary Value',
  MV = 'Multi-state Value',
  Calendar = 'Calendar',
  Device = 'Device',
  Notification = 'Notification',
  Schedule = 'Schedule',
  TrendLog = 'Trend Log',
  NetworkPort = 'Network Port',
  Accumulator = 'Accumulator'
}

enum ValueTypeEnum {
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean'
}

export const judgeValueType = (type: string): ValueTypeEnum => {
  if (type === TypeEnum.AV || type === TypeEnum.AI || type === TypeEnum.AO) {
    return ValueTypeEnum.NUMBER
  } else if (type === TypeEnum.MV) {
    return ValueTypeEnum.STRING
  } else if (type === TypeEnum.BI || type === TypeEnum.BO || type === TypeEnum.BV) {
    return ValueTypeEnum.BOOLEAN
  }
  return ValueTypeEnum.STRING
}

//[0, 0]
export const objIDTrans = (value: Array<number>) => {
  let text = ''

  if (value.length === 2) {
    text = DEVICE_TYPE_MAP[value[0]] + ',' + value[1]
  }
  return text
}

//units
export const unitsTrans = (value: any) => {
  let text = ''

  Object.entries(unitsJson).forEach(([key, val]) => {
    if (parseInt(key) === value) {
      text = val
    }
  })

  //console.log('unitsTrans', value, text)

  return text
}

//present-value
export const presentValueTrans = (value: any, type: string, BinaryOption: any, MVOption: any) => {
  let text = ''

  //console.log('presentValueTrans', value, type, BinaryOption, MVOption)

  if (type === TypeEnum.AI || type === TypeEnum.AV || type === TypeEnum.AO) {
    text = value
  } else if (type === TypeEnum.BI || type === TypeEnum.BV || type === TypeEnum.BO) {
    if (BinaryOption.length === 2) {
      BinaryOption.forEach((item: any) => {
        if (item.value === value) {
          text = item.label
        }
      })
    } else {
      text = value
    }
  } else if (type === TypeEnum.MV) {
    if (MVOption.length > 0) {
      MVOption.forEach((item: any) => {
        if (item.value === value) {
          text = item.label
        }
      })
    } else {
      text = value
    }
  }

  return text
}

export const deviceTrans = (data: any) => {
  let array: { [key: string]: any } = {}

  data.forEach((item: any) => {
    let name = PropertyMap.getName(item[1])
    if (name !== undefined) {
      name = camelToKebab(name)
    }

    let value = item[3]
    if (name !== undefined) {
      array[name] = value
    }
  })

  return array
}

function camelToKebab(camelCaseString: string) {
  return camelCaseString
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase()
}

export const BooleanOption = [
  { label: 'True', value: 1 },
  { label: 'False', value: 0 }
]

export const PriorityOption = [
  { label: 'None', value: null },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: '11', value: 11 },
  { label: '12', value: 12 },
  { label: '13', value: 13 },
  { label: '14', value: 14 },
  { label: '15', value: 15 },
  { label: '16', value: 16 }
]

export const isPriority = (type: string) => {
  let flag = false

  if (
    type === TypeEnum.MV ||
    type === TypeEnum.BV ||
    type === TypeEnum.BO ||
    type === TypeEnum.AV ||
    type === TypeEnum.AO
  ) {
    flag = true
  }

  return flag
}
