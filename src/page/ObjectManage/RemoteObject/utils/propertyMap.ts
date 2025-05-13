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

enum ValueTypeEnum {
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean'
}

export const judgeValueType = (type: string): ValueTypeEnum => {
  if (type === 'AV' || type === 'AI' || type === 'AO') {
    return ValueTypeEnum.NUMBER
  } else if (type === 'MV') {
    return ValueTypeEnum.STRING
  } else if (type === 'BI' || type === 'BO' || type === 'BV') {
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

  if (type === 'AI' || type === 'AV' || type === 'AO') {
    text = value
  } else if (type === 'BI' || type === 'BV' || type === 'BO') {
    if (BinaryOption.length === 2) {
      BinaryOption.forEach((item: any) => {
        if (item.value === value) {
          text = item.label
        }
      })
    } else {
      text = value
    }
  } else if (type === 'MV') {
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
