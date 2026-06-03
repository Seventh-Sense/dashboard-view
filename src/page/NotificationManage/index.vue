<template>
  <div class="notification-manage">
    
      <!-- 左侧：报警分类和统计 -->
      <div class="left-panel">
        <div class="panel-header">
          <h2 class="panel-title">报警分类</h2>
        </div>

        <div class="filter-section">
          <n-space vertical size="large">
            <div class="filter-group">
              <div class="filter-label">系统类型</div>
              <n-select
                v-model:value="searchParams.system"
                :options="systemOptions"
                placeholder="全部系统"
                clearable
                @update:value="handleSearch"
              />
            </div>

            <div class="filter-group">
              <div class="filter-label">报警等级</div>
              <n-select
                v-model:value="searchParams.level"
                :options="levelOptions"
                placeholder="全部等级"
                clearable
                @update:value="handleSearch"
              />
            </div>

            <div class="filter-group">
              <div class="filter-label">处理状态</div>
              <n-select
                v-model:value="searchParams.status"
                :options="statusOptions"
                placeholder="全部状态"
                clearable
                @update:value="handleSearch"
              />
            </div>

            <div class="filter-group">
              <n-input
                v-model:value="searchParams.keyword"
                placeholder="搜索报警信息"
                clearable
                @input="handleSearch"
              >
                <template #prefix>
                  <n-icon :component="SearchIcon" />
                </template>
              </n-input>
            </div>

            <n-button @click="handleReset" block>
              重置筛选
            </n-button>
          </n-space>
        </div>

        <div class="statistics-section">
          <div class="section-title">统计信息</div>
          <div class="statistics-list">
            <div class="stat-item">
              <div class="stat-label">总报警数</div>
              <div class="stat-value">{{ totalCount }}</div>
            </div>
            <div class="stat-item unhandled">
              <div class="stat-label">未处理</div>
              <div class="stat-value">{{ unhandledCount }}</div>
            </div>
            <div class="stat-item processing">
              <div class="stat-label">处理中</div>
              <div class="stat-value">{{ processingCount }}</div>
            </div>
            <div class="stat-item handled">
              <div class="stat-label">已处理</div>
              <div class="stat-value">{{ handledCount }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：报警列表 -->
      <div class="right-panel">
        <div class="panel-header">
          <h2 class="panel-title">报警列表</h2>
          <div class="header-actions">
            <n-space>
              <n-button @click="refreshData">
                <template #icon>
                  <n-icon :component="RefreshIcon" />
                </template>
                刷新
              </n-button>
            </n-space>
          </div>
        </div>

        <div class="table-wrapper">
          <n-data-table
            :columns="columns"
            :data="tableData"
            :pagination="pagination"
            :bordered="false"
            :single-line="true"
            size="medium"
            :scroll-x="1200"
          />
        </div>
      </div>
    

    <!-- 报警详情弹窗 -->
    <n-modal
      v-model:show="showDetailModal"
      preset="dialog"
      title="报警详情"
      :style="{ width: '600px' }"
    >
      <n-descriptions bordered :column="1">
        <n-descriptions-item label="报警 ID">{{ currentAlarm?.id }}</n-descriptions-item>
        <n-descriptions-item label="报警标题">{{ currentAlarm?.title }}</n-descriptions-item>
        <n-descriptions-item label="报警等级">
          <n-tag :type="getLevelType(currentAlarm?.level)" size="medium">
            {{ currentAlarm?.level }}
          </n-tag>
        </n-descriptions-item>
        <n-descriptions-item label="系统类型">{{ currentAlarm?.system }}</n-descriptions-item>
        <n-descriptions-item label="设备名称">{{ currentAlarm?.deviceName }}</n-descriptions-item>
        <n-descriptions-item label="设备位置">{{ currentAlarm?.location }}</n-descriptions-item>
        <n-descriptions-item label="报警内容">{{ currentAlarm?.content }}</n-descriptions-item>
        <n-descriptions-item label="发生时间">{{ currentAlarm?.time }}</n-descriptions-item>
        <n-descriptions-item label="处理状态">
          <n-tag :type="getStatusType(currentAlarm?.status)" size="medium">
            {{ currentAlarm?.status }}
          </n-tag>
        </n-descriptions-item>
        <n-descriptions-item label="处理人" v-if="currentAlarm?.handler">{{ currentAlarm?.handler }}</n-descriptions-item>
        <n-descriptions-item label="处理时间" v-if="currentAlarm?.handleTime">{{ currentAlarm?.handleTime }}</n-descriptions-item>
        <n-descriptions-item label="处理备注" v-if="currentAlarm?.remark">{{ currentAlarm?.remark }}</n-descriptions-item>
      </n-descriptions>
      <template #action>
        <n-space justify="end">
          <n-button @click="showDetailModal = false">关闭</n-button>
          <n-button
            v-if="currentAlarm?.status !== '已处理'"
            type="primary"
            @click="handleProcessAlarm"
          >
            立即处理
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 处理报警弹窗 -->
    <n-modal
      v-model:show="showProcessModal"
      preset="dialog"
      title="处理报警"
      :style="{ width: '500px' }"
      @positive-click="confirmProcess"
    >
      <n-form ref="processFormRef" :model="processForm" label-placement="top">
        <n-form-item label="处理备注" required>
          <n-input
            v-model:value="processForm.remark"
            type="textarea"
            placeholder="请输入处理备注"
            :rows="4"
          />
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, h } from 'vue'
import { NTag, NButton, NIcon } from 'naive-ui'
import { icon } from '@/plugins'
import dayjs from 'dayjs'

const { SearchIcon, RefreshIcon } = icon.ionicons5

interface AlarmData {
  id: string
  title: string
  level: string
  system: string
  deviceName: string
  location: string
  content: string
  time: string
  status: string
  handler?: string
  handleTime?: string
  remark?: string
}

const showDetailModal = ref(false)
const showProcessModal = ref(false)
const currentAlarm = ref<any>(null)

const processFormRef = ref(null)
const processForm = ref({
  remark: ''
})

const searchParams = reactive({
  keyword: '',
  level: null,
  status: null,
  system: null
})

const levelOptions = [
  { label: '紧急', value: '紧急' },
  { label: '重要', value: '重要' },
  { label: '一般', value: '一般' },
  { label: '提示', value: '提示' }
]

const statusOptions = [
  { label: '未处理', value: '未处理' },
  { label: '处理中', value: '处理中' },
  { label: '已处理', value: '已处理' }
]

const systemOptions = [
  { label: '暖通空调系统', value: '暖通空调系统' },
  { label: '给排水系统', value: '给排水系统' },
  { label: '照明系统', value: '照明系统' },
  { label: '电梯系统', value: '电梯系统' },
  { label: '供配电系统', value: '供配电系统' },
  { label: '消防系统', value: '消防系统' },
  { label: '安防系统', value: '安防系统' }
]

const mockAlarmList = ref<AlarmData[]>([])

const generateMockData = () => {
  const systems = ['暖通空调系统', '给排水系统', '照明系统', '电梯系统', '供配电系统', '消防系统', '安防系统']
  const levels = ['紧急', '重要', '一般', '提示']
  const statuses = ['未处理', '处理中', '已处理']
  const devices = [
    '空调机组', '新风机组', '风机盘管', '水泵', '水箱',
    '照明回路', '电梯控制器', '变压器', '烟雾探测器', '摄像头'
  ]
  const locations = [
    'A 栋 1 层', 'A 栋 2 层', 'A 栋 3 层', 'B 栋 1 层', 'B 栋 2 层',
    '地下室', '屋顶', '配电室', '水泵房', '电梯机房'
  ]
  const alarmTypes = [
    '温度过高报警', '压力异常报警', '水位过低报警', '设备故障报警',
    '通讯中断报警', '电源故障报警', '运行超时报警', '维护提醒'
  ]

  const data: AlarmData[] = []
  for (let i = 0; i < 85; i++) {
    const system = systems[Math.floor(Math.random() * systems.length)]
    const level = levels[Math.floor(Math.random() * levels.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const device = devices[Math.floor(Math.random() * devices.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]
    const alarmType = alarmTypes[Math.floor(Math.random() * alarmTypes.length)]
    
    const daysAgo = Math.floor(Math.random() * 30)
    const hoursAgo = Math.floor(Math.random() * 24)
    const minutesAgo = Math.floor(Math.random() * 60)
    const alarmTime = dayjs()
      .subtract(daysAgo, 'day')
      .subtract(hoursAgo, 'hour')
      .subtract(minutesAgo, 'minute')
    
    let handler, handleTime, remark
    if (status === '已处理' || status === '处理中') {
      handler = `工程师${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
      if (status === '已处理') {
        handleTime = alarmTime.add(Math.floor(Math.random() * 4), 'hour').format('YYYY-MM-DD HH:mm:ss')
        remark = '已检查并修复设备，系统恢复正常运行'
      } else {
        remark = '已派单，工程师正在前往现场'
      }
    }

    data.push({
      id: `ALM${String(20240001 + i).padStart(8, '0')}`,
      title: `${location}-${device}${alarmType}`,
      level,
      system,
      deviceName: device,
      location,
      content: `${device}在${location}发生${alarmType}，当前数值超出设定范围，请及时处理。`,
      time: alarmTime.format('YYYY-MM-DD HH:mm:ss'),
      status,
      handler,
      handleTime,
      remark
    })
  }
  
  mockAlarmList.value = data.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
}

generateMockData()

const refreshData = () => {
  generateMockData()
  handleSearch()
}

const getLevelType = (level: string) => {
  const typeMap: Record<string, any> = {
    '紧急': 'error',
    '重要': 'warning',
    '一般': 'info',
    '提示': 'success'
  }
  return typeMap[level] || 'default'
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    '未处理': 'warning',
    '处理中': 'info',
    '已处理': 'success'
  }
  return typeMap[status] || 'default'
}

const renderLevel = (row: AlarmData) => {
  return h(
    NTag,
    {
      type: getLevelType(row.level),
      size: 'small',
      bordered: false
    },
    {
      default: () => row.level
    }
  )
}

const renderStatus = (row: AlarmData) => {
  return h(
    NTag,
    {
      type: getStatusType(row.status),
      size: 'small',
      bordered: false
    },
    {
      default: () => row.status
    }
  )
}

const renderAction = (row: AlarmData) => {
  return h(
    NButton,
    {
      size: 'small',
      type: 'primary',
      onClick: () => handleViewDetail(row)
    },
    {
      default: () => '查看'
    }
  )
}

const columns = [
  {
    title: '报警 ID',
    key: 'id',
    width: 140,
    fixed: 'left',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '报警等级',
    key: 'level',
    width: 100,
    render: (row: AlarmData) => renderLevel(row)
  },
  {
    title: '报警标题',
    key: 'title',
    width: 280,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '系统类型',
    key: 'system',
    width: 140,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '设备位置',
    key: 'location',
    width: 120
  },
  {
    title: '发生时间',
    key: 'time',
    width: 160,
    sorter: 'default'
  },
  {
    title: '处理状态',
    key: 'status',
    width: 100,
    render: (row: AlarmData) => renderStatus(row)
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    fixed: 'right',
    render: (row: AlarmData) => renderAction(row)
  }
]

const filteredData = computed(() => {
  return mockAlarmList.value.filter((item) => {
    if (searchParams.keyword) {
      const keyword = searchParams.keyword.toLowerCase()
      const matchKeyword = 
        item.title.toLowerCase().includes(keyword) ||
        item.id.toLowerCase().includes(keyword) ||
        item.deviceName.toLowerCase().includes(keyword) ||
        item.location.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword)
      if (!matchKeyword) return false
    }
    
    if (searchParams.level && item.level !== searchParams.level) return false
    if (searchParams.status && item.status !== searchParams.status) return false
    if (searchParams.system && item.system !== searchParams.system) return false
    
    return true
  })
})

const tableData = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filteredData.value.slice(start, end)
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 50],
  onChange: (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  },
  itemCount: filteredData.value.length
})

const totalCount = computed(() => filteredData.value.length)
const unhandledCount = computed(() => filteredData.value.filter(item => item.status === '未处理').length)
const processingCount = computed(() => filteredData.value.filter(item => item.status === '处理中').length)
const handledCount = computed(() => filteredData.value.filter(item => item.status === '已处理').length)

const handleSearch = () => {
  pagination.page = 1
  pagination.itemCount = filteredData.value.length
}

const handleReset = () => {
  searchParams.keyword = ''
  searchParams.level = null
  searchParams.status = null
  searchParams.system = null
  handleSearch()
}

const handleViewDetail = (row: AlarmData) => {
  currentAlarm.value = row
  showDetailModal.value = true
}

const handleProcessAlarm = () => {
  showDetailModal.value = false
  showProcessModal.value = true
  processForm.value.remark = ''
}

const confirmProcess = () => {
  if (currentAlarm.value) {
    currentAlarm.value.status = '已处理'
    currentAlarm.value.handler = '当前用户'
    currentAlarm.value.handleTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    currentAlarm.value.remark = processForm.value.remark
    
    const index = mockAlarmList.value.findIndex(item => item.id === currentAlarm.value?.id)
    if (index !== -1) {
      mockAlarmList.value[index] = { ...currentAlarm.value }
    }
    
    showProcessModal.value = false
    handleSearch()
  }
}
</script>

<style lang="scss" scoped>
.notification-manage {
  height: calc(100vh - #{$--header-height} - 36px);
  display: flex;
  gap: 12px;
  padding: 12px;
  overflow: hidden;
  //box-sizing: border-box;
}

.notification-container {
  display: flex;
  height: 100%;
  gap: 12px;
  padding: 12px;
  overflow: hidden;
  box-sizing: border-box;
}

.left-panel {
  width: 320px;
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

.filter-section {
  padding: 20px;
  border-bottom: 1px solid rgba(102, 102, 255, 0.1);
}

.filter-group {
  .filter-label {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 8px;
  }
}

.statistics-section {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(102, 102, 255, 0.15);
}

.statistics-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  padding: 16px;
  background: linear-gradient(145deg, 
    rgba(255, 255, 255, 0.05) 0%, 
    rgba(255, 255, 255, 0.02) 100%
  );
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: linear-gradient(145deg, 
      rgba(102, 102, 255, 0.12) 0%, 
      rgba(102, 102, 255, 0.05) 100%
    );
    border-color: rgba(102, 102, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 102, 255, 0.15);
  }
  
  &.unhandled {
    .stat-value {
      color: #ffc14d;
    }
  }
  
  &.processing {
    .stat-value {
      color: #a8a8ff;
    }
  }
  
  &.handled {
    .stat-value {
      color: #20d896;
    }
  }
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.5px;
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
  overflow: hidden;
}

.table-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
  
  :deep(.n-data-table) {
    background: transparent;
    
    .n-data-table-th {
      background: rgba(102, 102, 255, 0.1);
      color: rgba(255, 255, 255, 0.9);
      font-weight: 600;
      font-size: 13px;
      padding: 12px 16px;
    }
    
    .n-data-table-td {
      background: transparent;
      color: rgba(255, 255, 255, 0.8);
      font-size: 13px;
      padding: 12px 16px;
      transition: all 0.2s;
      
      &:hover {
        background: rgba(102, 102, 255, 0.05);
      }
    }
    
    .n-data-table-tr:nth-child(even) {
      .n-data-table-td {
        background: rgba(255, 255, 255, 0.02);
      }
    }
  }
  
  :deep(.n-pagination) {
    margin-top: 16px;
    
    .n-pagination-item {
      &--active {
        background: rgba(102, 102, 255, 0.2);
        border-color: rgba(102, 102, 255, 0.4);
        color: #fff;
      }
    }
  }
}
</style>
