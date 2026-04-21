import axios, { AxiosResponse, InternalAxiosRequestConfig, AxiosError, AxiosInstance } from 'axios'
import { ResultEnum } from '@/enums/httpEnum'
import { ErrorPageNameMap } from '@/enums/pageEnum'
import { getLocalStorage, redirectErrorPage } from '@/utils'

const axiosTwo: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_2,
  timeout: ResultEnum.TIMEOUT
})

axiosTwo.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const user = getLocalStorage('userToken')

    //const token = user?.userInfo?.access_token
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc3Njc4MDUzMiwidHlwZSI6ImFjY2VzcyJ9.svPgDgs5LOk5GOmuLFyEuB2z3pdTEtKOqKzkzC1DxFU'
    if (token) {
      (config.headers as any)['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    Promise.reject(error)
  }
)

// 响应拦截器
axiosTwo.interceptors.response.use(
  (res: AxiosResponse) => {
    const { code } = res.data as { code: number }
    if (code === undefined || code === null) return Promise.resolve(res.data)
    if (code === ResultEnum.DATA_SUCCESS) return Promise.resolve(res.data)
    // 重定向
    if (ErrorPageNameMap.get(code)) redirectErrorPage(code)
    return Promise.resolve(res.data)
  },
  (err: AxiosResponse) => {
    Promise.reject(err)
  }
)

export default axiosTwo
