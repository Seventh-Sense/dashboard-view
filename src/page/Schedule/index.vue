<template>
  <div ref="containerRef" class="schedule-container">
    <!-- 左侧：对象列表 -->
    <div class="left-panel">
      <div class="panel-header">
        <h2 class="panel-title">{{ $t('schedule.object_list') }}</h2>
        <div class="header-actions">
          <n-button type="primary" size="small" @click="openAddModal">
            {{ $t('schedule.add_object') }}
          </n-button>
        </div>
      </div>

      <div class="object-list">
        <div
          v-for="item in objectList"
          :key="item.id"
          :class="['object-item', { active: selectedObject?.id === item.id }]"
          @click="selectObject(item)"
        >
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-type">{{ item.type }}</div>
          </div>
          <div class="item-actions">
            <n-button size="small" @click.stop="editObject(item)">
              {{ $t('schedule.edit') }}
            </n-button>
            <n-button size="small" type="error" @click.stop="deleteObject(item)">
              {{ $t('schedule.delete') }}
            </n-button>
          </div>
        </div>

        <div v-if="objectList.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <div class="empty-text">{{ $t('schedule.no_objects') }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧：详情面板 -->
      <div class="right-panel">
        <div v-if="selectedObject" class="detail-content">
        <div class="detail-header">
          <h3 class="detail-title">{{ selectedObject.name }}</h3>
          <span class="detail-type">{{ selectedObject.type }}</span>
        </div>

        <!-- Tab 切换 -->
        <n-tabs v-model:value="activeTab" type="segment" animated>
          <n-tab-pane name="weekly" :tab="$t('schedule.weekly_schedule')">
            <div class="schedule-section">
              <div class="section-header">
                <h4>{{ $t('schedule.weekly_schedule') }}</h4>
                <n-button size="small" @click="addWeeklySchedule">
                  {{ $t('schedule.add') }}
                </n-button>
              </div>
              
              <div class="weekly-timeline" :style="{ height: `${weeklyTimelineHeight}px` }">
                <!-- 星期标题行 -->
                <div class="weekday-header-row">
                  <div class="time-label-header">时间</div>
                  <div v-for="day in weekdays" :key="day.value" class="weekday-column">
                    <div class="weekday-name">{{ day.label }}</div>
                  </div>
                </div>

                <!-- 24 小时时间轴 -->
                <div class="timeline-content">
                  <div v-for="hour in 24" :key="hour" class="hour-row">
                    <div class="time-label">{{ String(hour - 1).padStart(2, '0') }}:00</div>
                    <div class="day-cells">
                      <div v-for="day in weekdays" :key="day.value" class="day-cell-container">
                        <!-- 显示该时间段的所有计划 -->
                        <div
                          v-for="schedule in getSchedulesForDayAndHour(day.value, hour)"
                          :key="schedule.id"
                          class="schedule-block"
                          :title="`${formatTime(schedule.time)} - ${schedule.value}`"
                          @contextmenu.prevent="handleContextMenu($event, schedule)"
                        >
                          <div class="schedule-time">{{ formatTime(schedule.time) }}</div>
                          <div class="schedule-value">{{ schedule.value }}</div>

                          <!-- 右键菜单 -->
                          <n-dropdown
                            :options="getContextMenuOptions(schedule)"
                            :show="
                              contextMenuState.show && contextMenuState.scheduleId === schedule.id
                            "
                            :x="contextMenuState.x"
                            :y="contextMenuState.y"
                            @select="(key: any) => handleScheduleContextMenu(key, schedule)"
                            @clickoutside="closeContextMenu"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="selectedObject.weeklySchedules.length === 0" class="empty-schedule">
                {{ $t('schedule.no_weekly_schedule') }}
              </div>
            </div>
          </n-tab-pane>

          <n-tab-pane name="special" :tab="$t('schedule.special_schedule')">
            <div class="schedule-section">
              <div class="section-header">
                <h4>{{ $t('schedule.special_schedule') }}</h4>
                <n-button size="small" @click="addSpecialSchedule">
                  {{ $t('schedule.add') }}
                </n-button>
              </div>
              <div class="special-timeline" :style="{ height: `${weeklyTimelineHeight}px` }">
                <div class="special-list">
                <div
                  v-for="(schedule, index) in selectedObject.specialSchedules"
                  :key="index"
                  class="special-item"
                >
                  <div class="special-info">
                    <div class="special-header">
                      <span :class="['priority-tag', getPriorityClass(schedule.priority)]">{{ getPriorityLabel(schedule.priority) }}</span>
                      <span class="mode-tag">{{ schedule.mode === 'single' ? $t('schedule.date') : $t('schedule.date_range') }}</span>
                    </div>
                    <div class="special-date">
                      <template v-if="schedule.mode === 'single'">
                        <template v-if="schedule.date?.year">{{ schedule.date.year }}年</template>
                        <template v-if="schedule.date?.month">{{ schedule.date.month }}月</template>
                        <template v-if="schedule.date?.day">{{ schedule.date.day }}日</template>
                        <template v-if="schedule.date?.week">{{ getWeekLabel(schedule.date.week) }}</template>
                        <template v-if="!schedule.date?.year && !schedule.date?.month && !schedule.date?.day && !schedule.date?.week">不限</template>
                      </template>
                      <template v-else-if="schedule.mode === 'range'">
                        <span class="date-range">
                          <!-- 开始日期 -->
                          <span class="date-start">
                            <template v-if="schedule.dateRange?.startDate?.year">{{ schedule.dateRange.startDate.year }}年</template>
                            <template v-if="schedule.dateRange?.startDate?.month">{{ schedule.dateRange.startDate.month }}月</template>
                            <template v-if="schedule.dateRange?.startDate?.day">{{ schedule.dateRange.startDate.day }}日</template>
                            <template v-if="schedule.dateRange?.startDate?.week">{{ getWeekLabel(schedule.dateRange.startDate.week) }}</template>
                            <template v-if="!schedule.dateRange?.startDate?.year && !schedule.dateRange?.startDate?.month && !schedule.dateRange?.startDate?.day && !schedule.dateRange?.startDate?.week">不限</template>
                          </span>
                          <span class="date-separator"> 至 </span>
                          <!-- 结束日期 -->
                          <span class="date-end">
                            <template v-if="schedule.dateRange?.endDate?.year">{{ schedule.dateRange.endDate.year }}年</template>
                            <template v-if="schedule.dateRange?.endDate?.month">{{ schedule.dateRange.endDate.month }}月</template>
                            <template v-if="schedule.dateRange?.endDate?.day">{{ schedule.dateRange.endDate.day }}日</template>
                            <template v-if="schedule.dateRange?.endDate?.week">{{ getWeekLabel(schedule.dateRange.endDate.week) }}</template>
                            <template v-if="!schedule.dateRange?.endDate?.year && !schedule.dateRange?.endDate?.month && !schedule.dateRange?.endDate?.day && !schedule.dateRange?.endDate?.week">不限</template>
                          </span>
                        </span>
                      </template>
                      <template v-else>
                        <span class="date-unknown">自定义模式</span>
                      </template>
                      <span class="date-type">({{ getDateTypeLabel(schedule.dateType) }})</span>
                    </div>
                    <div class="special-time">{{ $t('schedule.time') }}: {{ schedule.time }}</div>
                    <div class="special-value">{{ $t('schedule.value') }}: {{ schedule.value }}</div>
                  </div>
                  <div class="special-actions">
                    <n-button size="small" @click="editSpecialSchedule(schedule)">
                      {{ $t('schedule.edit') }}
                    </n-button>
                    <n-button size="small" type="error" @click="removeSpecialSchedule(index)">
                      {{ $t('schedule.remove') }}
                    </n-button>
                  </div>
                </div>
                <div v-if="selectedObject.specialSchedules.length === 0" class="empty-schedule">
                  {{ $t('schedule.no_special_schedule') }}
                </div>
              </div>
              </div>
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>

      <div v-else class="empty-detail">
        <div class="empty-icon">👆</div>
        <div class="empty-text">{{ $t('schedule.select_object') }}</div>
      </div>
    </div>

    <!-- 对象管理弹窗 -->
    <ObjectModal
      v-model:visible="showObjectModal"
      :is-edit="!!editingObject"
      :edit-data="editingObject || undefined"
      @save="handleSaveObject"
    />

    <!-- 每周计划弹窗 -->
    <WeeklyModal v-model:visible="showWeeklyModal" @save="handleSaveWeeklySchedule" />

    <!-- 编辑每周计划弹窗 -->
    <WeeklyModal
      v-model:visible="showEditWeeklyModal"
      :edit-data="editingSchedule || undefined"
      :is-edit="true"
      @save="handleSaveEditWeeklySchedule"
    />

    <!-- 特殊计划弹窗 -->
    <SpecialModal v-model:visible="showSpecialModal" @save="handleSaveSpecialSchedule" />
    
    <!-- 编辑特殊计划弹窗 -->
    <SpecialModal
      v-model:visible="showEditSpecialModal"
      :is-edit="true"
      :edit-data="editingSpecialSchedule"
      @save="handleSaveEditSpecialSchedule"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { NIcon, useMessage, useDialog } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { icon } from '@/plugins'
import ObjectModal from './components/ObjectModal.vue'
import WeeklyModal from './components/WeeklyModal.vue'
import SpecialModal from './components/SpecialModal.vue'

const { EditIcon, DeleteIcon } = icon.carbon
const message = useMessage()
const dialog = useDialog()
const { t } = useI18n()

interface WeeklySchedule {
  id: string
  time: string
  value: string
  day: string // 单个星期
}

interface SpecialSchedule {
  mode: 'single' | 'range' | string
  priority: number
  dateType: 'year' | 'month' | 'date' | 'week'
  date?: {
    year?: string
    month?: string
    day?: string
    week?: string
  }
  dateRange?: {
    startDate?: {
      year?: string
      month?: string
      day?: string
      week?: string
    }
    endDate?: {
      year?: string
      month?: string
      day?: string
      week?: string
    }
  }
  time: string
  value: string
}

interface ScheduleObject {
  id: string
  name: string
  type: string
  description: string
  weeklySchedules: WeeklySchedule[]
  specialSchedules: SpecialSchedule[]
}

const weekdays = [
  { label: '周一', value: 'mon' },
  { label: '周二', value: 'tue' },
  { label: '周三', value: 'wed' },
  { label: '周四', value: 'thu' },
  { label: '周五', value: 'fri' },
  { label: '周六', value: 'sat' },
  { label: '周日', value: 'sun' }
]

// 模拟数据
const objectList = ref<ScheduleObject[]>([
  {
    id: '1',
    name: '空调定时计划',
    type: 'schedule',
    description: '办公室空调定时开关',
    weeklySchedules: [
      { id: '1', time: '08:00', value: '开启', day: 'mon' },
      { id: '1-tue', time: '08:00', value: '开启', day: 'tue' },
      { id: '1-wed', time: '08:00', value: '开启', day: 'wed' },
      { id: '1-thu', time: '08:00', value: '开启', day: 'thu' },
      { id: '1-fri', time: '08:00', value: '开启', day: 'fri' },
      { id: '2', time: '18:00', value: '关闭', day: 'mon' },
      { id: '2-tue', time: '18:00', value: '关闭', day: 'tue' },
      { id: '2-wed', time: '18:00', value: '关闭', day: 'wed' },
      { id: '2-thu', time: '18:00', value: '关闭', day: 'thu' },
      { id: '2-fri', time: '18:00', value: '关闭', day: 'fri' },
      { id: '3', time: '09:00', value: '节能模式', day: 'sat' }
    ],
    specialSchedules: [
      { mode: 'single', priority: 9, dateType: 'date', date: { year: '2024', month: '01', day: '01', week: '' }, time: '00:00', value: '元旦关闭' },
      { mode: 'range', priority: 8, dateType: 'date', dateRange: { startDate: { year: '2024', month: '02', day: '09', week: '' }, endDate: { year: '2024', month: '02', day: '17', week: '' } }, time: '08:00', value: '春节模式' },
      { mode: 'single', priority: 7, dateType: 'date', date: { year: '2024', month: '04', day: '04', week: '' }, time: '09:00', value: '清明节值守' },
      { mode: 'single', priority: 6, dateType: 'date', date: { year: '2024', month: '05', day: '01', week: '' }, time: '00:00', value: '劳动节关闭' },
      { mode: 'range', priority: 5, dateType: 'date', dateRange: { startDate: { year: '2024', month: '06', day: '08', week: '' }, endDate: { year: '2024', month: '06', day: '10', week: '' } }, time: '07:00', value: '端午节能' },
      { mode: 'single', priority: 8, dateType: 'date', date: { year: '2024', month: '09', day: '17', week: '' }, time: '08:00', value: '中秋节模式' },
      { mode: 'range', priority: 9, dateType: 'date', dateRange: { startDate: { year: '2024', month: '10', day: '01', week: '' }, endDate: { year: '2024', month: '10', day: '07', week: '' } }, time: '00:00', value: '国庆长假' },
      { mode: 'single', priority: 4, dateType: 'week', date: { year: '2024', month: '03', day: '15', week: 'fri' }, time: '14:00', value: '周五维护' },
      { mode: 'single', priority: 6, dateType: 'month', date: { year: '2024', month: '07', day: '01', week: '' }, time: '10:00', value: '月初检查' },
      { mode: 'range', priority: 7, dateType: 'date', dateRange: { startDate: { year: '2024', month: '12', day: '24', week: '' }, endDate: { year: '2024', month: '12', day: '26', week: '' } }, time: '09:00', value: '圣诞节安排' }
    ]
  },
  {
    id: '2',
    name: '照明计划',
    type: 'schedule',
    description: '大楼照明定时控制',
    weeklySchedules: [
      { id: '4', time: '06:00', value: '开启', day: 'mon' },
      { id: '4-tue', time: '06:00', value: '开启', day: 'tue' },
      { id: '4-wed', time: '06:00', value: '开启', day: 'wed' },
      { id: '4-thu', time: '06:00', value: '开启', day: 'thu' },
      { id: '4-fri', time: '06:00', value: '开启', day: 'fri' },
      { id: '4-sat', time: '06:00', value: '开启', day: 'sat' },
      { id: '4-sun', time: '06:00', value: '开启', day: 'sun' },
      { id: '5', time: '18:00', value: '关闭', day: 'mon' },
      { id: '5-tue', time: '18:00', value: '关闭', day: 'tue' },
      { id: '5-wed', time: '18:00', value: '关闭', day: 'wed' },
      { id: '5-thu', time: '18:00', value: '关闭', day: 'thu' },
      { id: '5-fri', time: '18:00', value: '关闭', day: 'fri' },
      { id: '5-sat', time: '18:00', value: '关闭', day: 'sat' },
      { id: '5-sun', time: '18:00', value: '关闭', day: 'sun' }
    ],
    specialSchedules: []
  }
])

const selectedObject = ref<ScheduleObject | null>(null)
const showObjectModal = ref(false)
const editingObject = ref<ScheduleObject | null>(null)
const showWeeklyModal = ref(false)
const showSpecialModal = ref(false)
const showEditSpecialModal = ref(false)
const editingSpecialSchedule = ref<SpecialSchedule | null>(null)
const activeTab = ref<'weekly' | 'special'>('weekly')

// 实时高度计算
const containerRef = ref<HTMLElement | null>(null)
const rightPanelRef = ref<HTMLElement | null>(null)
const weeklyTimelineHeight = ref<number>(400)
let resizeObserver: ResizeObserver | null = null

const calculateHeight = async () => {
  await nextTick()
  
  // 尝试从 right-panel 获取高度
  const rightPanel = document.querySelector('.right-panel') as HTMLElement
  const detailContent = document.querySelector('.detail-content') as HTMLElement
  
  if (rightPanel && detailContent) {
    const rightPanelHeight = rightPanel.offsetHeight
    // 需要减去的高度：
    // 1. detail-header: 大约 60px (包括 margin)
    // 2. tabs 的 header: 大约 44px
    // 3. section-header: 48px (40px + 8px margin)
    const headerHeight = 60  // detail-header
    const tabsHeaderHeight = 44  // tabs header
    const sectionHeaderHeight = 48  // section-header (40 + 8)
    const totalDeduction = headerHeight + tabsHeaderHeight + sectionHeaderHeight
    
    weeklyTimelineHeight.value = rightPanelHeight - totalDeduction - 50
    //console.log('right-panel 高度:', rightPanelHeight, '计算后高度:', weeklyTimelineHeight.value)
  } else {
    console.log('未找到 right-panel 或 detail-content')
  }
}

const handleResize = () => {
  calculateHeight()
}

onMounted(() => {
  calculateHeight()
  window.addEventListener('resize', handleResize)
  
  // 使用 ResizeObserver 监听容器大小变化
  resizeObserver = new ResizeObserver(() => {
    calculateHeight()
  })
  
  const rightPanel = document.querySelector('.right-panel')
  if (rightPanel) {
    resizeObserver.observe(rightPanel)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

// 监听 selectedObject 和 activeTab 变化
watch([activeTab, () => selectedObject.value], () => {
  nextTick(() => {
    calculateHeight()
  })
})

// 右键菜单状态
const contextMenuState = ref({
  show: false,
  scheduleId: '',
  x: 0,
  y: 0
})

// 关闭右键菜单
const closeContextMenu = () => {
  contextMenuState.value.show = false
  contextMenuState.value.scheduleId = ''
}

// 编辑周计划状态
const editingSchedule = ref<{
  id: string
  time: string | Date | number
  value: string
  day: string
  days?: string[]
} | null>(null)
const showEditWeeklyModal = ref(false)

// 选择对象
const selectObject = (item: ScheduleObject) => {
  selectedObject.value = item
}

// 打开添加对象弹窗
const openAddModal = () => {
  editingObject.value = null
  showObjectModal.value = true
}

// 编辑对象
const editObject = (item: ScheduleObject) => {
  editingObject.value = item
  showObjectModal.value = true
}

// 删除对象
const deleteObject = (item: ScheduleObject) => {
  const index = objectList.value.findIndex(o => o.id === item.id)
  if (index > -1) {
    objectList.value.splice(index, 1)
    if (selectedObject.value?.id === item.id) {
      selectedObject.value = null
    }
  }
}

// 保存对象
const handleSaveObject = (formData: { name: string; type: string; description: string }) => {
  if (!formData.name) return

  if (editingObject.value) {
    const index = objectList.value.findIndex(o => o.id === editingObject.value?.id)
    if (index > -1) {
      objectList.value[index] = {
        ...objectList.value[index],
        name: formData.name,
        type: formData.type,
        description: formData.description
      }
      selectedObject.value = objectList.value[index]
    }
  } else {
    const newObject: ScheduleObject = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      description: formData.description,
      weeklySchedules: [],
      specialSchedules: []
    }
    objectList.value.push(newObject)
    selectedObject.value = newObject
  }
}

// 打开添加周计划弹窗
const addWeeklySchedule = () => {
  showWeeklyModal.value = true
}

// 获取右键菜单选项
const getContextMenuOptions = (schedule: WeeklySchedule) => {
  return [
    {
      label: () =>
        h('div', { style: 'display: flex; align-items: center; gap: 8px;' }, [
          h(NIcon, { size: 16 }, { default: () => h(EditIcon) }),
          t('schedule.edit_schedule')
        ]),
      key: 'edit'
    },
    {
      label: () =>
        h('div', { style: 'display: flex; align-items: center; gap: 8px; color: #ff4d4f;' }, [
          h(NIcon, { size: 16 }, { default: () => h(DeleteIcon) }),
          t('schedule.delete_schedule')
        ]),
      key: 'delete'
    }
  ]
}

// 处理右键点击
const handleContextMenu = (event: MouseEvent, schedule: WeeklySchedule) => {
  event.preventDefault()
  event.stopPropagation()

  // 设置菜单位置和状态
  contextMenuState.value = {
    show: true,
    scheduleId: schedule.id,
    x: event.clientX,
    y: event.clientY
  }
}

// 处理菜单项点击
const handleScheduleContextMenu = (key: string, schedule: WeeklySchedule) => {
  // 关闭菜单
  closeContextMenu()

  if (key === 'edit') {
    editWeeklySchedule(schedule)
  } else if (key === 'delete') {
    deleteWeeklySchedule(schedule)
  }
}

// 编辑周计划
const editWeeklySchedule = (schedule: WeeklySchedule) => {
  // 保存当前编辑的计划，确保包含 day 字段和正确的类型
  editingSchedule.value = {
    id: schedule.id,
    time: schedule.time,
    value: schedule.value,
    day: schedule.day,
    days: [schedule.day]
  }

  // 打开编辑弹窗
  showEditWeeklyModal.value = true

  // 调试日志
  console.log('编辑周计划:', editingSchedule.value)
}

// 保存编辑的周计划
const handleSaveEditWeeklySchedule = (formData: {
  time: number | null
  value: string
  days: string[]
}) => {
  if (!editingSchedule.value || !selectedObject.value) {
    console.error('编辑保存失败：缺少 editingSchedule 或 selectedObject')
    return
  }

  // 格式化时间为字符串
  const timeStr = formatTime(formData.time)
  if (!timeStr) {
    message.error(t('schedule.please_select_time'))
    return
  }

  // 校验
  if (!formData.value || !formData.value.trim()) {
    message.error(t('schedule.please_enter_value'))
    return
  }

  if (formData.value.trim().length > 100) {
    message.error(t('schedule.value_max_length'))
    return
  }

  if (formData.days.length === 0) {
    message.error(t('schedule.please_select_day'))
    return
  }

  // 找到在 objectList 中的索引
  const objIndex = objectList.value.findIndex(obj => obj.id === selectedObject.value?.id)
  if (objIndex === -1) {
    console.error('未找到对象索引')
    return
  }

  // 更新计划（只更新当前选中的单个计划块）
  const updatedSchedules = objectList.value[objIndex].weeklySchedules.map(s => {
    if (s.id === editingSchedule.value?.id) {
      return {
        ...s,
        time: timeStr,
        value: formData.value.trim(),
        day: formData.days[0] || editingSchedule.value.day
      }
    }
    return s
  })

  objectList.value[objIndex].weeklySchedules = updatedSchedules
  selectedObject.value = objectList.value[objIndex]

  message.success(t('schedule.schedule_updated'))
  showEditWeeklyModal.value = false
  editingSchedule.value = null
}

// 删除周计划
const deleteWeeklySchedule = (schedule: WeeklySchedule) => {
  dialog.warning({
    title: t('schedule.delete_schedule'),
    content: t('schedule.confirm_delete_schedule'),
    positiveText: t('schedule.delete'),
    negativeText: t('schedule.cancel'),
    onPositiveClick: () => {
      if (!selectedObject.value) return

      const objIndex = objectList.value.findIndex(obj => obj.id === selectedObject.value?.id)
      if (objIndex === -1) return

      // 创建新数组（过滤掉要删除的项）以触发响应式更新
      const updatedSchedules = objectList.value[objIndex].weeklySchedules.filter(
        s => s.id !== schedule.id
      )
      objectList.value[objIndex].weeklySchedules = updatedSchedules

      // 更新选中的对象为新的引用
      selectedObject.value = objectList.value[objIndex]

      message.success(t('schedule.schedule_deleted'))
    }
  })
}

// 格式化时间显示
const formatTime = (time: any) => {
  if (!time) return ''

  if (typeof time === 'string') {
    return time
  }

  // 如果是数字（时间戳），转换为 Date 对象
  if (typeof time === 'number') {
    const date = new Date(time)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  if (time instanceof Date) {
    const hours = String(time.getHours()).padStart(2, '0')
    const minutes = String(time.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  // 如果是对象且有 _d 属性（可能是自定义时间对象）
  if (typeof time === 'object' && time._d instanceof Date) {
    const hours = String(time._d.getHours()).padStart(2, '0')
    const minutes = String(time._d.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  return ''
}

// 获取指定星期和小时的计划
const getSchedulesForDayAndHour = (day: string, hour: number) => {
  if (!selectedObject.value) return []

  const schedules = selectedObject.value.weeklySchedules.filter(schedule => {
    if (schedule.day !== day) return false

    let timeStr = ''
    if (typeof schedule.time === 'string') {
      timeStr = schedule.time
    } else if (typeof schedule.time === 'number') {
      const date = new Date(schedule.time)
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      timeStr = `${hours}:${minutes}`
    } else {
      return false
    }

    const scheduleHour = parseInt(timeStr.split(':')[0])
    return scheduleHour === hour
  })

  // 按时间排序（精确到分钟）
  return schedules.sort((a, b) => {
    const getTimeValue = (schedule: WeeklySchedule) => {
      if (typeof schedule.time === 'string') {
        const [hours, minutes] = schedule.time.split(':').map(Number)
        return hours * 60 + minutes
      } else if (typeof schedule.time === 'number') {
        const date = new Date(schedule.time)
        return date.getHours() * 60 + date.getMinutes()
      }
      return 0
    }

    return getTimeValue(a) - getTimeValue(b)
  })
}

// 保存周计划
const handleSaveWeeklySchedule = (formData: { time: any; value: string; days: string[] }) => {
  if (!selectedObject.value) return

  // 格式化时间为字符串
  const timeStr = formatTime(formData.time)

  if (!timeStr || !formData.value || formData.days.length === 0) {
    return
  }

  // 找到在 objectList 中的索引
  const index = objectList.value.findIndex(obj => obj.id === selectedObject.value?.id)
  if (index === -1) return

  // 为每个选中的星期创建独立的计划对象
  const newSchedules = formData.days.map(day => ({
    id: `${Date.now()}-${day}`,
    time: timeStr,
    value: formData.value,
    day: day
  }))

  // 创建新的数组以触发响应式更新
  const updatedSchedules = [...objectList.value[index].weeklySchedules, ...newSchedules]
  objectList.value[index].weeklySchedules = updatedSchedules

  // 更新选中的对象为新的引用
  selectedObject.value = objectList.value[index]
}

// 删除周计划
const removeWeeklySchedule = (index: number) => {
  if (!selectedObject.value) return

  const objIndex = objectList.value.findIndex(obj => obj.id === selectedObject.value?.id)
  if (objIndex === -1) return

  // 创建新数组（过滤掉要删除的项）以触发响应式更新
  const updatedSchedules = objectList.value[objIndex].weeklySchedules.filter((_, i) => i !== index)
  objectList.value[objIndex].weeklySchedules = updatedSchedules

  // 更新选中的对象为新的引用
  selectedObject.value = objectList.value[objIndex]
}

// 获取优先级标签
const getPriorityLabel = (priority: number) => {
  return String(priority)
}

// 获取优先级样式类
const getPriorityClass = (priority: number) => {
  if (priority >= 8) return 'high'
  if (priority >= 5) return 'medium'
  return 'low'
}

// 获取日期类型标签
const getDateTypeLabel = (dateType: string) => {
  const labels: Record<string, string> = {
    year: '年',
    month: '月',
    date: '日',
    week: '周'
  }
  return labels[dateType] || dateType
}

// 获取星期标签
const getWeekLabel = (week: string) => {
  const labels: Record<string, string> = {
    mon: '周一',
    tue: '周二',
    wed: '周三',
    thu: '周四',
    fri: '周五',
    sat: '周六',
    sun: '周日'
  }
  return labels[week] || week
}

// 打开添加特殊计划弹窗
const addSpecialSchedule = () => {
  showSpecialModal.value = true
}

// 保存特殊计划
const handleSaveSpecialSchedule = (formData: {
  mode: 'single' | 'range' | string
  priority: number
  dateType: 'year' | 'month' | 'date' | 'week'
  date?: {
    year?: string
    month?: string
    day?: string
    week?: string
  }
  dateRange?: {
    startDate?: {
      year?: string
      month?: string
      day?: string
      week?: string
    }
    endDate?: {
      year?: string
      month?: string
      day?: string
      week?: string
    }
  }
  time: string
  value: string
}) => {

  console.log('formData:', formData)
  if (!selectedObject.value) {
    message.error(t('schedule.please_select_object'))
    return
  }

  console.log('保存特殊计划数据:', formData)

  const newSchedule: SpecialSchedule = {
    mode: formData.mode,
    priority: formData.priority,
    dateType: formData.dateType,
    time: formData.time,
    value: formData.value
  }

  if (formData.mode === 'single' && formData.date) {
    newSchedule.date = formData.date
  }

  if (formData.mode === 'range' && formData.dateRange) {
    newSchedule.dateRange = formData.dateRange
  }

  console.log('构建的特殊计划对象:', newSchedule)

  const index = objectList.value.findIndex(obj => obj.id === selectedObject.value?.id)
  if (index === -1) {
    message.error(t('schedule.object_not_found'))
    return
  }

  const updatedSchedules = [...objectList.value[index].specialSchedules, newSchedule]
  objectList.value[index].specialSchedules = updatedSchedules

  selectedObject.value = objectList.value[index]
  
  message.success(t('schedule.special_schedule_saved'))
  console.log('保存成功，当前特殊计划列表:', objectList.value[index].specialSchedules)
}

// 编辑特殊计划
const editSpecialSchedule = (schedule: SpecialSchedule) => {
  console.log('编辑特殊计划 - 原始数据:', schedule)
  editingSpecialSchedule.value = schedule
  showEditSpecialModal.value = true
  console.log('编辑特殊计划 - 传递数据:', editingSpecialSchedule.value)
}

// 保存编辑的特殊计划
const handleSaveEditSpecialSchedule = (formData: {
  mode: 'single' | 'range' | string
  priority: number
  dateType: 'year' | 'month' | 'date' | 'week'
  date?: {
    year?: string
    month?: string
    day?: string
    week?: string
  }
  dateRange?: {
    startDate?: {
      year?: string
      month?: string
      day?: string
      week?: string
    }
    endDate?: {
      year?: string
      month?: string
      day?: string
      week?: string
    }
  }
  time: string
  value: string
}) => {
  if (!editingSpecialSchedule.value || !selectedObject.value) {
    console.error('编辑保存失败：缺少 editingSpecialSchedule 或 selectedObject')
    return
  }

  // 找到在 objectList 中的索引
  const objIndex = objectList.value.findIndex(obj => obj.id === selectedObject.value?.id)
  if (objIndex === -1) {
    console.error('未找到对象索引')
    return
  }

  // 构建更新后的计划对象
  const updatedSchedule: SpecialSchedule = {
    mode: formData.mode,
    priority: formData.priority,
    dateType: formData.dateType,
    time: formData.time,
    value: formData.value
  }

  if (formData.mode === 'single' && formData.date) {
    updatedSchedule.date = formData.date
  }

  if (formData.mode === 'range' && formData.dateRange) {
    updatedSchedule.dateRange = formData.dateRange
  }

  // 找到要更新的计划在数组中的索引
  const scheduleIndex = selectedObject.value.specialSchedules.indexOf(editingSpecialSchedule.value)
  if (scheduleIndex === -1) {
    console.error('未找到要更新的特殊计划')
    return
  }

  // 更新计划
  const updatedSchedules = [...objectList.value[objIndex].specialSchedules]
  updatedSchedules[scheduleIndex] = updatedSchedule
  objectList.value[objIndex].specialSchedules = updatedSchedules

  selectedObject.value = objectList.value[objIndex]
  
  message.success(t('schedule.schedule_updated'))
  showEditSpecialModal.value = false
  editingSpecialSchedule.value = null
}

// 删除特殊计划
const removeSpecialSchedule = (index: number) => {
  if (!selectedObject.value) return

  const objIndex = objectList.value.findIndex(obj => obj.id === selectedObject.value?.id)
  if (objIndex === -1) return

  const schedule = selectedObject.value.specialSchedules[index]
  
  dialog.warning({
    title: t('schedule.delete_schedule'),
    content: t('schedule.confirm_delete_special_schedule'),
    positiveText: t('schedule.delete'),
    negativeText: t('schedule.cancel'),
    onPositiveClick: () => {
      // 创建新数组（过滤掉要删除的项）以触发响应式更新
      const updatedSchedules = objectList.value[objIndex].specialSchedules.filter((_, i) => i !== index)
      objectList.value[objIndex].specialSchedules = updatedSchedules

      // 更新选中的对象为新的引用
      selectedObject.value = objectList.value[objIndex]
      
      message.success(t('schedule.schedule_deleted'))
    }
  })
}
</script>

<style lang="scss" scoped>
.schedule-container {
  display: flex;
  height: calc(100vh - #{$--header-height} - 36px);
  gap: 12px;
  padding: 12px;
  overflow: hidden;
  //box-sizing: border-box;
}

.left-panel {
  width: 380px;
  height: 100%;
  @include fetch-bg-color('card-background');
  @include fetch-theme('box-shadow');
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(102, 102, 255, 0.2);
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.object-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.object-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px;
  margin-bottom: 10px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(
      145deg,
      rgba(102, 102, 255, 0.12) 0%,
      rgba(102, 102, 255, 0.05) 100%
    );
    border-color: rgba(102, 102, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 102, 255, 0.15);
  }

  &.active {
    background: linear-gradient(
      145deg,
      rgba(102, 102, 255, 0.18) 0%,
      rgba(102, 102, 255, 0.08) 100%
    );
    border-color: rgba(102, 102, 255, 0.45);
    box-shadow: 0 4px 15px rgba(102, 102, 255, 0.2);
  }
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-name {
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  letter-spacing: 0.3px;
}

.item-type {
  font-size: 12px;
  color: #888;
  padding: 2px 8px;
  background: rgba(102, 102, 255, 0.1);
  border-radius: 10px;
  align-self: flex-start;
}

.item-actions {
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.object-item:hover .item-actions {
  opacity: 1;
}

.object-item.active .item-actions {
  opacity: 1;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  color: #666;
  font-size: 14px;
}

.right-panel {
  flex: 1;
  @include fetch-bg-color('card-background');
  @include fetch-theme('box-shadow');
  border-radius: 18px;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  padding: 16px;
  box-sizing: border-box;
  // 确保面板不会超出父容器
  overflow: hidden;
}

.detail-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0; // 允许 flex 子项缩小
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(102, 102, 255, 0.2);
}

.detail-title {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.detail-type {
  padding: 4px 12px;
  background: rgba(102, 102, 255, 0.2);
  border-radius: 20px;
  font-size: 12px;
  color: #a8a8ff;
}

.schedule-section {
  // 使用 flex 布局自动占据剩余空间，不设置固定高度
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; // 允许 flex 子项缩小
  position: relative;
}

.section-header {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.section-header h4 {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.weekly-timeline {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(102, 102, 255, 0.15);
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: height 0.2s ease;
}

.weekday-header-row {
  display: flex;
  background: linear-gradient(135deg, rgba(102, 102, 255, 0.15), rgba(102, 102, 255, 0.08));
  border-bottom: 1px solid rgba(102, 102, 255, 0.2);
  flex-shrink: 0;
  backdrop-filter: blur(10px);
}

.time-label-header {
  width: 80px;
  padding: 12px 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(102, 102, 255, 0.2);
  border-right: 1px solid rgba(102, 102, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.weekday-column {
  flex: 1;
  padding: 12px 6px;
  text-align: center;
  border-right: 1px solid rgba(102, 102, 255, 0.1);

  &:last-child {
    border-right: none;
  }
}

.weekday-name {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.5px;
}

.timeline-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
  scrollbar-gutter: stable;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(102, 102, 255, 0.4), rgba(102, 102, 255, 0.6));
    border-radius: 5px;
    border: 2px solid transparent;
    background-clip: padding-box;

    &:hover {
      background: linear-gradient(180deg, rgba(102, 102, 255, 0.6), rgba(102, 102, 255, 0.8));
      background-clip: padding-box;
    }
  }
}

.hour-row {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
  align-items: stretch;
  min-height: 44px;
  height: auto;
  flex-shrink: 0;

  &:hover {
    background: rgba(102, 102, 255, 0.05);
  }

  &:nth-child(even) {
    background: rgba(255, 255, 255, 0.02);
  }
}

.time-label {
  width: 80px;
  padding: 0 8px;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: #a8a8ff;
  background: rgba(102, 102, 255, 0.08);
  border-right: 1px solid rgba(102, 102, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 100%;
}

.day-cells {
  flex: 1;
  display: flex;
  min-width: 0;
}

.day-cell-container {
  flex: 1;
  padding: 3px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  height: auto;
  min-height: 38px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  overflow: visible;

  &:last-child {
    border-right: none;
  }
}

.schedule-block {
  width: 100%;
  min-height: 32px;
  height: auto;
  padding: 4px 3px;
  background: linear-gradient(135deg, rgba(102, 102, 255, 0.25), rgba(139, 92, 246, 0.2));
  border: 1px solid rgba(102, 102, 255, 0.35);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-1px);
    background: linear-gradient(135deg, rgba(102, 102, 255, 0.35), rgba(139, 92, 246, 0.3));
    border-color: rgba(102, 102, 255, 0.5);
    box-shadow: 0 4px 12px rgba(102, 102, 255, 0.25);
  }

  &:active {
    transform: scale(0.98);
  }

  .schedule-time {
    font-size: 10px;
    font-weight: 600;
    color: #a8a8ff;
    text-align: center;
    margin-bottom: 1px;
    line-height: 1.2;
  }

  .schedule-value {
    font-size: 11px;
    font-weight: 500;
    color: #ffffff;
    text-align: center;
    word-break: break-word;
    line-height: 1.2;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}

// 右键菜单 - 确保不占用空间
:deep(.n-dropdown) {
  display: contents;
}

// 右键菜单样式 - 确保 n-dropdown 内容正确显示
:deep(.n-dropdown) {
  .n-dropdown__container {
    .n-dropdown-option {
      padding: 10px 16px;
      font-size: 14px;
      transition: all 0.2s;

      &:hover {
        background: rgba(102, 102, 255, 0.1);
      }
    }
  }
}

// 右键菜单样式
:deep(.n-dropdown-option) {
  padding: 10px 16px;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: rgba(102, 102, 255, 0.1);
  }
}

.empty-schedule {
  padding: 40px 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  flex-shrink: 0;
}

.special-timeline {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  border: 1px solid rgba(102, 102, 255, 0.15);
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: height 0.2s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.special-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px 16px 20px 16px;
  scrollbar-gutter: stable;
  min-height: 0;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(102, 102, 255, 0.5), rgba(102, 102, 255, 0.7));
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: padding-box;
    
    &:hover {
      background: linear-gradient(180deg, rgba(102, 102, 255, 0.7), rgba(102, 102, 255, 0.9));
      background-clip: padding-box;
    }
  }
}

.special-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(145deg, 
    rgba(255, 255, 255, 0.08) 0%, 
    rgba(255, 255, 255, 0.04) 100%
  );
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      rgba(102, 102, 255, 0.8), 
      rgba(139, 92, 246, 0.6)
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: linear-gradient(145deg, 
      rgba(102, 102, 255, 0.15) 0%, 
      rgba(139, 92, 246, 0.1) 100%
    );
    border-color: rgba(102, 102, 255, 0.3);
    box-shadow: 0 6px 20px rgba(102, 102, 255, 0.15);
    transform: translateY(-2px);
    
    &::before {
      opacity: 1;
    }
  }
}

.special-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.special-header {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.priority-tag {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  transition: all 0.2s ease;
  
  &.high {
    background: rgba(255, 77, 77, 0.2);
    color: #ff6b6b;
    border: 1px solid rgba(255, 77, 77, 0.3);
  }
  
  &.medium {
    background: rgba(255, 170, 0, 0.2);
    color: #ffc14d;
    border: 1px solid rgba(255, 170, 0, 0.3);
  }
  
  &.low {
    background: rgba(0, 186, 124, 0.2);
    color: #20d896;
    border: 1px solid rgba(0, 186, 124, 0.3);
  }
}

.mode-tag {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(102, 102, 255, 0.2);
  color: #b8b8ff;
  border: 1px solid rgba(102, 102, 255, 0.3);
  letter-spacing: 0.5px;
}

.special-date {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid rgba(102, 102, 255, 0.5);
}

.date-type {
  font-size: 12px;
  color: #999;
  font-weight: 500;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  
  .date-start,
  .date-end {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
  }
  
  .date-separator {
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    padding: 0 4px;
  }
}

.special-time {
  font-size: 13px;
  color: #b8b8ff;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: '🕐';
    font-size: 14px;
  }
}

.special-value {
  font-size: 13px;
  color: #ffffff;
  font-weight: 500;
  padding: 8px 12px;
  background: rgba(102, 102, 255, 0.15);
  border-radius: 8px;
  border: 1px solid rgba(102, 102, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '�';
    font-size: 14px;
  }
}

.special-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 12px;
  border-left: 1px solid rgba(102, 102, 255, 0.15);
  
  .n-button {
    min-width: 70px;
    border-radius: 8px;
    font-weight: 500;
    font-size: 13px;
    transition: all 0.2s ease;
    
    &[type='error'] {
      background: rgba(255, 77, 77, 0.2);
      border-color: rgba(255, 77, 77, 0.35);
      color: #ff6b6b;
      
      &:hover {
        background: rgba(255, 77, 77, 0.3);
        border-color: rgba(255, 77, 77, 0.5);
        transform: translateY(-1px);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
}

.empty-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

:deep(.n-tabs) {
  height: 100%;
  display: flex;
  flex-direction: column;

  .n-tabs-tab {
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 500;
    color: #888;
    transition: all 0.3s;

    &.n-tabs-tab--active {
      color: #fff;
    }
  }

  .n-tabs-tab-bar {
    background: rgba(102, 102, 255, 0.15);
    flex-shrink: 0;
  }

  .n-tabs-pane-wrapper {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .n-tab-pane {
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 0;
  }
}
</style>
