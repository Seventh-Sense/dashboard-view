/**
 * Ollama API 服务
 * Ollama 提供了兼容 OpenAI 的 API 接口
 * 默认地址: http://localhost:11434
 */

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatCompletionRequest {
  model: string
  messages: ChatMessage[]
  stream?: boolean
  temperature?: number
  max_tokens?: number
}

interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: ChatMessage
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface OllamaModel {
  name: string
  model: string
  modified_at: string
  size: number
  digest: string
  details: {
    parent_model: string
    format: string
    family: string
    families: string[]
    parameter_size: string
    quantization_level: string
  }
}

interface OllamaTagsResponse {
  models: OllamaModel[]
}

export const OLLAMA_BASE_URL = import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434'
export const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'qwen2.5:latest'

/**
 * 获取 Ollama 已安装的模型列表
 * @returns 模型列表
 */
export const getModelList = async (): Promise<OllamaModel[]> => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error(`获取模型列表失败: ${response.status}`)
    }

    const data: OllamaTagsResponse = await response.json()
    return data.models || []
  } catch (error) {
    console.error('获取 Ollama 模型列表失败:', error)
    throw error
  }
}

/**
 * 发送聊天消息到 Ollama
 * @param messages 聊天消息历史
 * @param options 可选配置
 * @returns AI 回复内容
 */
export const sendChatMessage = async (
  messages: ChatMessage[],
  options?: {
    model?: string
    temperature?: number
    max_tokens?: number
    signal?: AbortSignal
  }
): Promise<string> => {
  const { model = OLLAMA_MODEL, temperature = 0.7, max_tokens = 2048, signal } = options || {}

  const requestBody: ChatCompletionRequest = {
    model,
    messages: [
      {
        role: 'system',
        content: '你是一个有用的 AI 助手。'
      },
      ...messages
    ],
    stream: false,
    temperature,
    max_tokens
  }

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `请求失败: ${response.status}`)
    }

    const data: ChatCompletionResponse = await response.json()
    return data.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Ollama API 调用失败:', error)
    throw error
  }
}

/**
 * 流式发送聊天消息到 Ollama
 * @param messages 聊天消息历史
 * @param onChunk 接收每个 chunk 的回调
 * @param options 可选配置
 */
export const sendChatMessageStream = async (
  messages: ChatMessage[],
  onChunk: (content: string) => void,
  options?: {
    model?: string
    temperature?: number
    max_tokens?: number
    signal?: AbortSignal
  }
): Promise<void> => {
  const { model = OLLAMA_MODEL, temperature = 0.7, max_tokens = 2048, signal } = options || {}

  const requestBody: ChatCompletionRequest = {
    model,
    messages: [
      {
        role: 'system',
        content: '你是一个有用的 AI 助手。'
      },
      ...messages
    ],
    stream: true,
    temperature,
    max_tokens
  }

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `请求失败: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('无法读取响应流')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim()
          if (data === '[DONE]') return

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices[0]?.delta?.content || ''
            if (content) {
              onChunk(content)
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  } catch (error) {
    console.error('Ollama 流式 API 调用失败:', error)
    throw error
  }
}

/**
 * 检查 Ollama 服务是否可用
 * @returns 是否可用
 */
export const checkOllamaAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET'
    })
    return response.ok
  } catch {
    return false
  }
}
