import axiosInstance from './axios'
import {
  RequestHttpEnum,
  ContentTypeEnum,
  RequestBodyEnum,
  RequestDataTypeEnum,
  RequestContentTypeEnum,
  RequestParamsObjType
} from '@/enums/httpEnum'
import type {
  RequestGlobalConfigType,
  RequestConfigType
} from '@/store/modules/chartEditStore/chartEditStore.d'

export const get = (url: string, params?: object) => {
  return axiosInstance({
    url: url,
    method: RequestHttpEnum.GET,
    params: params
  })
}

export const post = (url: string, data?: object | string, headersType?: string) => {
  return axiosInstance({
    url: url,
    method: RequestHttpEnum.POST,
    data: data,
    headers: {
      'Content-Type': headersType || ContentTypeEnum.JSON
    }
  })
}

export const patch = (url: string, data?: object, headersType?: string) => {
  return axiosInstance({
    url: url,
    method: RequestHttpEnum.PATCH,
    data: data,
    headers: {
      'Content-Type': headersType || ContentTypeEnum.JSON
    }
  })
}

export const put = (url: string, data?: object, headersType?: ContentTypeEnum) => {
  return axiosInstance({
    url: url,
    method: RequestHttpEnum.PUT,
    data: data,
    headers: {
      'Content-Type': headersType || ContentTypeEnum.JSON
    }
  })
}

export const del = (url: string, params?: object) => {
  return axiosInstance({
    url: url,
    method: RequestHttpEnum.DELETE,
    params
  })
}

// 获取请求函数，默认get
export const http = (type?: RequestHttpEnum) => {
  switch (type) {
    case RequestHttpEnum.GET:
      return get

    case RequestHttpEnum.POST:
      return post

    case RequestHttpEnum.PATCH:
      return patch

    case RequestHttpEnum.PUT:
      return put

    case RequestHttpEnum.DELETE:
      return del

    default:
      return get
  }
}
const prefix = 'javascript:'
// 对输入字符进行转义处理
export const translateStr = (target: string | object) => {
  if (typeof target === 'string') {
    if (target.startsWith(prefix)) {
      const funcStr = target.split(prefix)[1]
      let result
      try {
        result = new Function(`${funcStr}`)()
      } catch (error) {
        console.log(error)
        window['$message'].error('js内容解析有误！')
      }
      return result
    } else {
      return target
    }
  }
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      const subTarget = (target as any)[key]
      ;(target as any)[key] = translateStr(subTarget)
    }
  }
  return target
}

/**
 * * 自定义请求
 * @param targetParams 当前组件参数
 * @param globalParams 全局参数
 */
export const customizeHttp = (
  targetParams: RequestConfigType,
  globalParams: RequestGlobalConfigType
) => {
  if (!targetParams || !globalParams) {
    return
  }
  // 全局
  const {
    // 全局请求源地址
    requestOriginUrl,
    // 全局请求内容
    requestParams: globalRequestParams
  } = globalParams

  // 目标组件（优先级 > 全局组件）
  const {
    // 请求地址
    requestUrl,
    // 普通 / sql
    requestContentType,
    // 获取数据的方式
    requestDataType,
    // 请求方式 get/post/del/put/patch
    requestHttpType,
    // 请求体类型 none / form-data / x-www-form-urlencoded / json /xml
    requestParamsBodyType,
    // SQL 请求对象
    requestSQLContent,
    // 请求内容 params / cookie / header / body: 同 requestParamsBodyType
    requestParams: targetRequestParams
  } = targetParams

  // 静态排除
  if (requestDataType === RequestDataTypeEnum.STATIC) return

  if (!requestUrl) {
    return
  }

  // 处理头部
  let headers: RequestParamsObjType = {
    ...globalRequestParams.Header,
    ...targetRequestParams.Header
  }
  headers = translateStr(headers)

  // data 参数
  let data: RequestParamsObjType | FormData | string = {}
  // params 参数
  let params: RequestParamsObjType = { ...targetRequestParams.Params }
  params = translateStr(params)
  // form 类型处理
  let formData: FormData = new FormData()
  // 类型处理

  switch (requestParamsBodyType) {
    case RequestBodyEnum.NONE:
      break

    case RequestBodyEnum.JSON:
      headers['Content-Type'] = ContentTypeEnum.JSON
      //json对象也能使用'javasctipt:'来动态拼接参数
      data = translateStr(targetRequestParams.Body['json'])
      if (typeof data === 'string') data = JSON.parse(data)
      // json 赋值给 data
      break

    case RequestBodyEnum.XML:
      headers['Content-Type'] = ContentTypeEnum.XML
      // xml 字符串赋值给 data
      data = translateStr(targetRequestParams.Body['xml'])
      break

    case RequestBodyEnum.X_WWW_FORM_URLENCODED: {
      headers['Content-Type'] = ContentTypeEnum.FORM_URLENCODED
      const bodyFormData = targetRequestParams.Body['x-www-form-urlencoded']
      for (const i in bodyFormData) formData.set(i, translateStr(bodyFormData[i]))
      // FormData 赋值给 data
      data = formData
      break
    }

    case RequestBodyEnum.FORM_DATA: {
      headers['Content-Type'] = ContentTypeEnum.FORM_DATA
      const bodyFormUrlencoded = targetRequestParams.Body['form-data']
      for (const i in bodyFormUrlencoded) {
        formData.set(i, translateStr(bodyFormUrlencoded[i]))
      }
      // FormData 赋值给 data
      data = formData
      break
    }
  }

  // sql 处理
  if (requestContentType === RequestContentTypeEnum.SQL) {
    headers['Content-Type'] = ContentTypeEnum.JSON
    data = requestSQLContent
  }

  try {
    const url = new Function('return `' + `${requestOriginUrl}${requestUrl}`.trim() + '`')()
    return axiosInstance({
      url,
      method: requestHttpType,
      data,
      params,
      headers
    })
  } catch (error) {
    console.log(error)
    window['$message'].error('URL地址格式有误！')
  }
}

export const onLogin = async (user: any) => {
  let data = new URLSearchParams({
    username: user.username,
    password: user.password
  }).toString()

  try {
    const response = await post(`/login`, data, ContentTypeEnum.FORM_URLENCODED)
    
    return response
  } catch (error) {
    throw error
  }
}

export const readDemoData = async () => {
  try {
    const response = await get(`/items`)
    
    return response
  } catch (error) {
    throw error
  }
}

export const readDeivceList = async () => {
  try {
    const response = await get(`/allpoints/`)
    
    return response
  } catch (error) {
    throw error
  }
}

export const readDeivceData = async () => {
  try {
    const response = await get(`/points/?offset=0&limit=100`)
    
    
    return response
  } catch (error) {
    throw error
  }
}

//modbus
export const createModbusConfig = async (data: any) => {
  try {
    const response = await post(`/modbus/`, data)
    
    return response
  } catch (error) {
    throw error
  }
}

export const readModbusConfig = async () => {
  try {
    const response = await get(`/modbus/?offset=0&limit=100`)
    
    return response
  } catch (error) {
    throw error
  }
}

export const writeModbusConfig = async (id: any, data: any) => {
  try {
    const response = await patch(`/modbus/` + id, data)
    
    return response
  } catch (error) {
    throw error
  }
}

export const delModbusConfig = async (id: any) => {
  try {
    const response = await del(`/modbus/` + id)
    
    return response
  } catch (error) {
    throw error
  }
}

export const readComs = async () => {
  try {
    const response = await get(`/coms`)
    
    return response
  } catch (error) {
    throw error
  }
}

export const readPoints = async () => {
  try {
    const response = await get(`/point/?offset=0&limit=100`)
    
    return response
  } catch (error) {
    throw error
  }
}

export const readPointById = async (id: any) => {
  try {
    const response = await get(`/point/` + id)
    
    return response
  } catch (error) {
    throw error
  }
}

export const writePoint = async (data: any) => {
  try {
    const response = await post(`/point/`, data)
    
    return response
  } catch (error) {
    throw error
  }
}

export const updatePoint = async (id: any, data: any) => {
  try {
    const response = await patch(`/point/` + id, data)
    
    return response
  } catch (error) {
    throw error
  }
}

export const deletePoint = async (id: any) => {
  try {
    const response = await del(`/point/` + id)
    
    return response
  } catch (error) {
    throw error
  }
}

//project
export const readProjectList = async () => {
  try {
    const response = await get(`/project/?offset=0&limit=100`)
    
    return response
  } catch (error) {
    throw error
  }
}

export const createProject = async (data: any) => {
  try {
    const response = await post(`/project/`, data)
    
    return response
  } catch (error) {
    throw error
  }
}

export const readProject = async (id: any) => {
  try {
    const response = await get(`/project/` + id)
    
    return response
  } catch (error) {
    throw error
  }
}

export const updateProject = async (id: any, data: any) => {
  try {
    const response = await patch(`/project/` + id, data)
    
    return response
  } catch (error) {
    throw error
  }
}

export const deleteProject = async (id: any) => {
  try {
    const response = await del(`/project/` + id)
    
    return response
  } catch (error) {
    throw error
  }
}

export const getVersion = async () => {
  try {
    const response = await get(`/version`)
    
    return response
  } catch (error) {
    throw error
  }
}


//展会相关接口
export const sendParams = async (data: any) => {
  try {
    const response = await post(`/device/request`, data)
    
    return response
  } catch (error) {
    throw error
  }
}

export const readChartData = async (data: any) => {
  try {
    const response = await post(`/points`, data)
    
    return response
  } catch (error) {
    throw error
  }
}