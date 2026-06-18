<template>
  <teleport to="body">
    <!-- 悬浮小球 -->
    <div
      class="ai-float-ball"
      :class="{ 'is-dragging': isDragging }"
      :style="{
        position: 'fixed',
        right: '20px',
        bottom: '80px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 99999,
        userSelect: 'none',
        transition: 'box-shadow 0.3s ease, transform 0.2s ease',
        ...ballStyle
      }"
      @mousedown="handleMouseDown"
      @click="handleBallClick"
    >
      <n-icon size="24" color="#fff">
        <SparklesIcon />
      </n-icon>
    </div>

    <!-- AI 弹窗 -->
    <transition name="ai-popup">
      <div v-if="showPopup" class="ai-popup-container" :style="popupStyle">
      <!-- 弹窗头部 -->
      <div class="ai-popup-header">
        <div class="header-left">
          <n-icon size="20" color="#6366f1">
            <SparklesIcon />
          </n-icon>
          <span class="title">{{ t('aiFloatElf.ai_assistant') }}</span>
        </div>
        <div class="header-actions">
          <n-icon
            class="action-icon"
            size="18"
            @click="handleMinimize"
          >
            <RemoveIcon />
          </n-icon>
          <n-icon
            class="action-icon"
            size="18"
            @click="handleClose"
          >
            <CloseIcon />
          </n-icon>
        </div>
      </div>

      <!-- 聊天内容区 -->
      <div class="ai-popup-content" ref="contentRef">
        <div v-if="messages.length === 0" class="empty-state">
          <n-icon size="48" color="#9ca3af">
            <ChatbubbleEllipsesIcon />
          </n-icon>
          <p class="empty-text">{{ t('aiFloatElf.greeting') }}</p>
          <p class="empty-desc">{{ t('aiFloatElf.greeting_desc') }}</p>
        </div>
        <div v-else class="messages-list">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="message-item"
            :class="msg.role"
            v-show="msg.content"
          >
            <div class="message-avatar">
              <n-icon size="20" :color="msg.role === 'user' ? '#3b82f6' : '#6366f1'">
                <PersonIcon v-if="msg.role === 'user'" />
                <SparklesIcon v-else />
              </n-icon>
            </div>
            <div class="message-content">
              <div class="message-text">{{ msg.content }}</div>
              <div class="message-time">{{ msg.time }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区 -->
      <div class="ai-popup-footer">
        <n-input
          v-model:value="inputValue"
          type="textarea"
          :placeholder="t('aiFloatElf.input_placeholder')"
          :autosize="{ minRows: 1, maxRows: 4 }"
          @keydown="handleKeyDown"
          :disabled="isLoading"
        />
        <n-button
          v-if="isLoading"
          type="error"
          size="small"
          @click="handleCancel"
        >
          {{ t('aiFloatElf.cancel') }}
        </n-button>
        <n-button
          v-else
          type="primary"
          size="small"
          :disabled="!inputValue.trim()"
          @click="handleSend"
        >
          {{ t('aiFloatElf.send') }}
        </n-button>
      </div>
    </div>
  </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { NIcon, NInput, NButton, useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { icon } from '@/plugins'
import { sendChatMessage, sendChatMessageStream, checkOllamaAvailable } from '@/api/ollama'

const { t } = useI18n()
const message = useMessage()

const {
  SparklesIcon,
  CloseIcon,
  RemoveIcon,
  ChatbubbleEllipsesIcon,
  PersonIcon
} = icon.ionicons5

interface Message {
  role: 'user' | 'ai'
  content: string
  time: string
}

// 小球位置
const ballPosition = reactive({
  x: window.innerWidth - 80,
  y: window.innerHeight - 150
})

const ballSize = 56
const edgeBarWidth = 8 // 边缘条形宽度
const edgeBarHeight = 60 // 边缘条形高度
const isDragging = ref(false)
const isCollapsed = ref(false)
const collapseEdge = ref<'left' | 'right' | 'top' | 'bottom' | null>(null) // 收缩的边缘方向
const showPopup = ref(false)
const inputValue = ref('')
const isLoading = ref(false)
const contentRef = ref<HTMLElement | null>(null)
const abortController = ref<AbortController | null>(null)

const messages = ref<Message[]>([])

// 是否有正在流式输出的消息
const hasStreamingMessage = computed(() => {
  const lastMsg = messages.value[messages.value.length - 1]
  return lastMsg && lastMsg.role === 'ai' && lastMsg.content === '' && isLoading.value
})

// 拖拽相关
let isMouseDown = false
let hasMoved = false
let startX = 0
let startY = 0
let startBallX = 0
let startBallY = 0

const ballStyle = computed(() => {
  const baseStyle: Record<string, string> = {}

  if (isCollapsed.value && collapseEdge.value) {
    // 收缩成边缘条形
    if (collapseEdge.value === 'left' || collapseEdge.value === 'right') {
      baseStyle.width = `${edgeBarWidth}px`
      baseStyle.height = `${edgeBarHeight}px`
      baseStyle.borderRadius = '4px'
      baseStyle.top = `${ballPosition.y}px`
    } else {
      baseStyle.width = `${edgeBarHeight}px`
      baseStyle.height = `${edgeBarWidth}px`
      baseStyle.borderRadius = '4px'
      baseStyle.left = `${ballPosition.x}px`
    }

    // 根据边缘方向定位
    if (collapseEdge.value === 'left') {
      baseStyle.left = '0px'
      baseStyle.right = 'auto'
    } else if (collapseEdge.value === 'right') {
      baseStyle.left = `${window.innerWidth - edgeBarWidth}px`
      baseStyle.right = 'auto'
    } else if (collapseEdge.value === 'top') {
      baseStyle.top = '0px'
      baseStyle.bottom = 'auto'
    } else if (collapseEdge.value === 'bottom') {
      baseStyle.top = `${window.innerHeight - edgeBarWidth}px`
      baseStyle.bottom = 'auto'
    }
  } else {
    // 正常小球
    baseStyle.width = `${ballSize}px`
    baseStyle.height = `${ballSize}px`
    baseStyle.borderRadius = '50%'

    // 如果拖拽过，使用 left/top 定位
    if (ballPosition.x !== window.innerWidth - 80 || ballPosition.y !== window.innerHeight - 150) {
      baseStyle.left = `${ballPosition.x}px`
      baseStyle.top = `${ballPosition.y}px`
      baseStyle.right = 'auto'
      baseStyle.bottom = 'auto'
    }
  }

  return baseStyle
})

const popupStyle = computed(() => {
  const popupWidth = 400
  const popupHeight = 600
  const margin = 20

  let x = ballPosition.x - popupWidth / 2 + ballSize / 2
  let y = ballPosition.y - popupHeight - 20

  // 边界检测
  if (x < margin) x = margin
  if (x + popupWidth > window.innerWidth - margin) {
    x = window.innerWidth - popupWidth - margin
  }
  if (y < margin) {
    y = ballPosition.y + ballSize + 20
  }

  return {
    left: `${x}px`,
    top: `${y}px`,
    width: `${popupWidth}px`,
    height: `${popupHeight}px`
  }
})

const handleMouseDown = (e: MouseEvent) => {
  isMouseDown = true
  hasMoved = false
  startX = e.clientX
  startY = e.clientY
  startBallX = ballPosition.x
  startBallY = ballPosition.y

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  e.preventDefault()
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isMouseDown) return

  const deltaX = e.clientX - startX
  const deltaY = e.clientY - startY

  // 判断是否发生了移动（避免点击被误判为拖拽）
  if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
    hasMoved = true
    isDragging.value = true
  }

  ballPosition.x = startBallX + deltaX
  ballPosition.y = startBallY + deltaY

  // 边界限制
  const maxX = window.innerWidth - ballSize
  const maxY = window.innerHeight - ballSize

  ballPosition.x = Math.max(0, Math.min(ballPosition.x, maxX))
  ballPosition.y = Math.max(0, Math.min(ballPosition.y, maxY))
}

const handleMouseUp = () => {
  isMouseDown = false
  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)

  // 检查是否在边缘，如果在边缘则收缩
  checkEdgeCollapse()
}

// 检查是否在边缘并决定是否收缩
const checkEdgeCollapse = () => {
  const edgeThreshold = 10 // 边缘判定阈值（像素）
  const maxX = window.innerWidth - ballSize
  const maxY = window.innerHeight - ballSize

  const isAtLeftEdge = ballPosition.x <= edgeThreshold
  const isAtRightEdge = ballPosition.x >= maxX - edgeThreshold
  const isAtTopEdge = ballPosition.y <= edgeThreshold
  const isAtBottomEdge = ballPosition.y >= maxY - edgeThreshold

  // 计算球心位置
  const ballCenterX = ballPosition.x + ballSize / 2
  const ballCenterY = ballPosition.y + ballSize / 2

  // 如果在任意边缘，则收缩
  if (isAtLeftEdge) {
    isCollapsed.value = true
    collapseEdge.value = 'left'
    ballPosition.x = 0
    // 保持球心的垂直位置
    ballPosition.y = Math.max(0, Math.min(ballCenterY - edgeBarHeight / 2, window.innerHeight - edgeBarHeight))
  } else if (isAtRightEdge) {
    isCollapsed.value = true
    collapseEdge.value = 'right'
    ballPosition.x = window.innerWidth - edgeBarWidth
    // 保持球心的垂直位置
    ballPosition.y = Math.max(0, Math.min(ballCenterY - edgeBarHeight / 2, window.innerHeight - edgeBarHeight))
  } else if (isAtTopEdge) {
    isCollapsed.value = true
    collapseEdge.value = 'top'
    ballPosition.y = 0
    // 保持球心的水平位置
    ballPosition.x = Math.max(0, Math.min(ballCenterX - edgeBarHeight / 2, window.innerWidth - edgeBarHeight))
  } else if (isAtBottomEdge) {
    isCollapsed.value = true
    collapseEdge.value = 'bottom'
    ballPosition.y = window.innerHeight - edgeBarWidth
    // 保持球心的水平位置
    ballPosition.x = Math.max(0, Math.min(ballCenterX - edgeBarHeight / 2, window.innerWidth - edgeBarHeight))
  } else {
    isCollapsed.value = false
    collapseEdge.value = null
  }
}

// 点击收缩的小球时展开
const handleCollapsedBallClick = () => {
  if (isCollapsed.value) {
    isCollapsed.value = false
    collapseEdge.value = null
    // 恢复到正常位置，确保小球不会贴着边缘
    const maxX = window.innerWidth - ballSize
    const maxY = window.innerHeight - ballSize
    const margin = 20 // 边距
    
    // 如果小球在边缘，给它一个合适的边距
    if (ballPosition.x <= edgeBarWidth) {
      ballPosition.x = margin
    } else if (ballPosition.x >= window.innerWidth - edgeBarWidth) {
      ballPosition.x = maxX - margin
    } else {
      ballPosition.x = Math.max(margin, Math.min(ballPosition.x, maxX - margin))
    }
    
    if (ballPosition.y <= edgeBarWidth) {
      ballPosition.y = margin
    } else if (ballPosition.y >= window.innerHeight - edgeBarWidth) {
      ballPosition.y = maxY - margin
    } else {
      ballPosition.y = Math.max(margin, Math.min(ballPosition.y, maxY - margin))
    }
  }
}

const handleBallClick = () => {
  // 如果是拖拽操作，不触发点击
  if (hasMoved) return

  // 如果小球处于收缩状态，先展开
  if (isCollapsed.value) {
    handleCollapsedBallClick()
    // 展开后延迟弹出对话框，让动画先完成
    setTimeout(() => {
      showPopup.value = true
    }, 300)
    return
  }

  showPopup.value = !showPopup.value
}

const handleClose = () => {
  showPopup.value = false
}

const handleMinimize = () => {
  showPopup.value = false
}

const getCurrentTime = () => {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

const scrollToBottom = () => {
  nextTick(() => {
    if (contentRef.value) {
      contentRef.value.scrollTop = contentRef.value.scrollHeight
    }
  })
}

const handleSend = async () => {
  const content = inputValue.value.trim()
  if (!content || isLoading.value) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content,
    time: getCurrentTime()
  })

  inputValue.value = ''
  isLoading.value = true
  scrollToBottom()

  // 创建 AbortController 用于取消请求
  abortController.value = new AbortController()

  // 添加一个空的 AI 消息用于流式更新
  const aiMessageIndex = messages.value.length
  messages.value.push({
    role: 'ai',
    content: '',
    time: getCurrentTime()
  })

  try {
    // 构建消息历史（保留最近 10 条消息作为上下文）
    const recentMessages = messages.value.slice(-11, -1).map(msg => ({
      role: msg.role === 'ai' ? 'assistant' as const : msg.role,
      content: msg.content
    }))

    // 使用流式 API，逐字更新回复
    await sendChatMessageStream(
      recentMessages,
      (chunk) => {
        messages.value[aiMessageIndex].content += chunk
        scrollToBottom()
      },
      {
        signal: abortController.value.signal
      }
    )
  } catch (error: any) {
    // 如果是被取消的请求
    if (error.name === 'AbortError') {
      if (messages.value[aiMessageIndex]?.content) {
        messages.value[aiMessageIndex].content += t('aiFloatElf.reply_cancelled_suffix')
      } else {
        messages.value[aiMessageIndex].content = t('aiFloatElf.reply_cancelled')
      }
      return
    }

    // 移除空消息
    messages.value.splice(aiMessageIndex, 1)

    // 检查是否是 Ollama 服务未启动
    const available = await checkOllamaAvailable()
    if (!available) {
      message.error(t('aiFloatElf.ollama_not_started'))
    } else {
      message.error(t('aiFloatElf.request_failed'))
    }

    // 添加错误提示消息
    messages.value.push({
      role: 'ai',
      content: t('aiFloatElf.ai_unavailable'),
      time: getCurrentTime()
    })
  } finally {
    isLoading.value = false
    abortController.value = null
  }
}

// 取消 AI 回复
const handleCancel = () => {
  if (abortController.value) {
    abortController.value.abort()
    isLoading.value = false
    abortController.value = null
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

// 窗口大小变化时更新小球位置
const handleResize = () => {
  const maxX = window.innerWidth - ballSize
  const maxY = window.innerHeight - ballSize
  ballPosition.x = Math.min(ballPosition.x, maxX)
  ballPosition.y = Math.min(ballPosition.y, maxY)
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style lang="scss">
.ai-float-ball {
  position: fixed;
  right: 20px;
  bottom: 80px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 99999;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;

  &:hover {
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    transform: scale(1.05);
  }

  &.is-dragging {
    transition: none;
    cursor: grabbing;
  }
}

.ai-popup-container {
  position: fixed;
  background: #1a1a2e;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 100000;
  color: #e5e7eb;

  .ai-popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;

      .title {
        font-size: 16px;
        font-weight: 600;
      }
    }

    .header-actions {
      display: flex;
      gap: 8px;

      .action-icon {
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.2s;

        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }

  .ai-popup-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #1a1a2e;

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;

      .empty-text {
        margin-top: 16px;
        font-size: 18px;
        font-weight: 600;
        color: #e5e7eb;
      }

      .empty-desc {
        margin-top: 8px;
        font-size: 14px;
        color: #9ca3af;
      }
    }

    .messages-list {
      .message-item {
        display: flex;
        gap: 12px;
        margin-bottom: 20px;

        &.user {
          flex-direction: row-reverse;

          .message-content {
            align-items: flex-end;

            .message-text {
              background: #3b82f6;
              color: #fff;
            }
          }
        }

        &.ai {
          .message-text {
            background: #2d2d44;
            color: #e5e7eb;
          }
        }

        .message-avatar {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #2d2d44;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .message-content {
          display: flex;
          flex-direction: column;
          max-width: 70%;

          .message-text {
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.5;
            word-break: break-word;
          }

          .message-time {
            margin-top: 4px;
            font-size: 12px;
            color: #6b7280;
          }
        }
      }

      .loading-dots {
        display: flex;
        gap: 6px;
        padding: 12px 16px;
        background: #2d2d44;
        border-radius: 12px;

        span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6366f1;
          animation: loading-bounce 1.4s infinite ease-in-out both;

          &:nth-child(1) {
            animation-delay: -0.32s;
          }

          &:nth-child(2) {
            animation-delay: -0.16s;
          }
        }
      }
    }
  }

  .ai-popup-footer {
    display: flex;
    gap: 12px;
    padding: 16px;
    border-top: 1px solid #2d2d44;
    background: #1a1a2e;

    .n-input {
      flex: 1;

      .n-input__textarea-el {
        resize: none;
        background: #2d2d44;
        color: #e5e7eb;
      }
    }
  }
}

.ai-popup-enter-active {
  transition: all 0.3s ease;
}

.ai-popup-leave-active {
  transition: all 0.2s ease;
}

.ai-popup-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}

.ai-popup-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(5px);
}

@keyframes loading-bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
