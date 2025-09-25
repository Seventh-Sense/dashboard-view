<template>
  <n-modal :show="isShowModal">
    <n-card
      :bordered="true"
      role="dialog"
      aria-modal="true"
      size="small"
      :mask-closable="false"
      class="modal"
    >
      <template #header>
        <n-space justify="space-between" align="center">
          <span class="modal-title">
            {{ $t('device.add_point') }}
          </span>
          <img
            style="cursor: pointer"
            @click="onClose"
            width="24"
            height="24"
            :src="SVG_ICON.card_icons.dismiss"
          />
        </n-space>
      </template>

      <div style="height: 400px; overflow-y: auto">
        <div v-if="loading" class="modal-loading">
          <n-spin />
        </div>
        <n-tree
          v-else
          checkable
          cascade
          block-node
          checkbox-placement="right"
          key-field="node_id"
          label-field="display_name"
          :data="data"
          :on-load="handleLoad"
          :render-switcher-icon="renderSwitcherIcon"
          :render-label="renderLabel"
          :render-prefix="renderPrefix"
          :check-on-click="true"
          :on-update:checked-keys="handleCheck"
          :default-checked-keys="defaultCheckedKeys"
        ></n-tree>
      </div>

      <template v-if="!isEdit" #footer>
        <n-space justify="end">
          <div class="modal-button-close" @click="onClose">{{ $t('global.r_cancel') }}</div>
          <n-button class="modal-button-ok" :loading="loadingButton" @click="onSubmit">
            {{ $t('global.r_ok') }}
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { onMounted, ref, h, inject, computed } from 'vue'
import SVG_ICON from '@/svg/SVG_ICON'
import { addSubscribePoint, readIotPoints } from '@/api/http'
import { NIcon } from 'naive-ui'
import { ChevronForward, Leaf, LeafOutline } from '@vicons/ionicons5'
import type { TreeOption } from 'naive-ui'
import { OPCUATreeNode as TreeNode } from '../../utils/utils'

const t = window['$t']

let emit = defineEmits(['update:isShowModal'])
const refreshObjTable: any = inject('refreshObjTable')

const props = defineProps({
  isShowModal: {
    type: Boolean,
    required: true
  },
  isEdit: {
    type: Boolean,
    required: true
  },
  deviceData: {
    type: Object,
    required: true
  },
  editData: {
    type: Object,
    required: true
  },
  dataList: {
    type: Array,
    required: true
  }
})

const loading = ref(false)
const loadingButton = ref(false)

const data = ref<any>([])

const checkedKeys = ref<Array<any>>([])

const defaultCheckedKeys = computed(() => {
  return props.dataList.map((item: any) => item.metric_id)
})

onMounted(() => {
  readRootTree()
})

const renderSwitcherIcon = () => {
  return h(NIcon, null, { default: () => h(ChevronForward) })
}

function renderPrefix({ option }: { option: TreeOption }) {
  if (option.isLeaf === false) {
    return null
  }
  return h(NIcon, null, { default: () => h(Leaf) })
}

function renderLabel({ option }: { option: any }) {
  return h(
    'div',
    {
      class: 'tree-node-content'
    },
    [
      h('span', { class: 'node-name' }, option.display_name),
      h('span', { class: 'node-type' }, option.data_type),
      h('span', { class: 'node-placeholder' })
    ]
  )
}

const readRootTree = async () => {
  loading.value = true

  try {
    const rootNodes = await fetchNodeData('root')

    data.value = rootNodes

    // 处理默认选中节点的禁用状态
    applyDefaultCheckedDisabled(rootNodes)

    //更新选中状态
    updateCheckedState()
  } catch (error) {
    console.error('获取根节点时发生错误:', error)
    window['$message'].error(t('msg.msg_error_2'))
    data.value = []
  } finally {
    loading.value = false
  }
}

const handleLoad = (node: TreeNode) => {
  return new Promise<void>(async resolve => {
    try {
      // 加载子节点数据
      const childNodes = await fetchNodeData(node.node_id)

      // 处理子节点属性
      childNodes.forEach(child => {
        // 变量类型节点标记为叶子节点并允许勾选
        if (child.node_class === 'NodeClass.Variable') {
          child.isLeaf = true
          child.checkboxDisabled = false
        }
      })

      // 处理默认选中节点的禁用状态
      applyDefaultCheckedDisabled(childNodes)

      node.children = childNodes

      //更新选中状态
      updateCheckedState()
    } catch (error) {
      console.error(`获取节点 ${node.node_id} 子项时发生错误:`, error)
      node.children = []
    } finally {
      resolve()
    }
  })
}

const fetchNodeData = async (nodeId: string): Promise<TreeNode[]> => {
  const params: any = {
    function: 'discovery',
    parms: { nodeid: nodeId }
  }

  const res: any = await readIotPoints(props.deviceData.key, params)

  if (res.status !== 'OK') {
    console.warn(`获取节点 ${nodeId} 失败，状态:`, res.status)
    throw new Error(`Response status: ${res.status}`)
  }

  // 转换为所需的节点格式
  return res.data.map(
    (item: any): TreeNode => ({
      ...item,
      isLeaf: false, // 默认非叶子节点，可根据实际情况调整
      checkboxDisabled: true
    })
  )
}

//children 全是叶子节点时，父节点允许全部勾选
const updateCheckedState = () => {
  // 递归处理每个节点的内部函数
  const processNode = (node: any): boolean => {
    if (node.isLeaf) {
      return true
    }

    if (!node.children || node.children.length === 0) {
      return false
    }

    let allChildrenAreLeaf = true
    node.children.forEach((child: any) => {
      const childIsLeaf = processNode(child)
      if (!childIsLeaf) {
        allChildrenAreLeaf = false
      }
    })

    if (allChildrenAreLeaf) {
      node.checkboxDisabled = false
    }

    return node.isLeaf
  }

  // 处理所有根节点
  if (Array.isArray(data.value)) {
    data.value.forEach((node: any) => {
      processNode(node)
    })
  }

  //console.log('更新后的数据:', data.value);
}

// 处理默认选中节点的禁用状态
const applyDefaultCheckedDisabled = (nodes: TreeNode[]) => {
  nodes.forEach(node => {
    if (defaultCheckedKeys.value.includes(node.node_id)) {
      node.checkboxDisabled = true
    }
  })
}

const handleCheck = (
  keys: Array<string | number>,
  option: Array<TreeOption | null>,
  meta: { node: TreeOption | null; action: 'check' | 'uncheck' }
) => {
  console.log('勾选状态变化:', keys, option, meta)
  checkedKeys.value = option.filter(item => item !== null) as Array<any>
}

const onSubmit = async () => {
  loadingButton.value = true

  console.log('勾选状态变化:', checkedKeys.value)
  try {
    if (checkedKeys.value.length === 0) {
      return
    }

    const list = checkedKeys.value
      .filter(item => !defaultCheckedKeys.value.includes(item.node_id))
      .map(item => {
        return {
          uid: item?.node_id || '',
          name: item?.display_name || '',
          property: {},
          tags: '',
          description: '',
          device_id: props.deviceData.key
        }
      })

    const res: any = await addSubscribePoint(list)

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      return
    }

    refreshObjTable()
  } catch (e) {
    console.warn('handleSubmit', e)
  } finally {
    loadingButton.value = false
    emit('update:isShowModal', false)
  }
}

const onClose = () => {
  emit('update:isShowModal', false)
}
</script>

<style lang="scss" scoped>
.modal {
  width: 800px;
  background: #{$--color-dark-modal-content};
  backdrop-filter: blur(50px);
  border-radius: 18px;

  &-title {
    font-size: 20px;
    color: #{$--color-dark-font};
    font-style: normal;
    text-transform: none;
    font-weight: bold;
  }

  &-porperty {
    font-size: 12px;
    color: #{$--color-dark-modal-title};
    font-style: normal;
    font-weight: 400;
    margin-top: 20px;
  }

  &-button-close {
    width: 72px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #{$--color-dark-border};
    border-radius: 2px;
    background-color: #{$--color-dark-card-image};
    cursor: pointer;
  }

  &-button-ok {
    width: 72px;
    height: 32px;
    border: 0;
    border-radius: 2px;
  }

  &-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
  }
}

::v-deep(.tree-node-content) {
  display: grid;
  grid-template-columns: 3fr 2fr 1fr; /* 三列布局：左侧名称、中间类型、右侧占位 */
  align-items: center;
  width: 100%;
  gap: 32px;
}

::v-deep(.node-name) {
  /* 与类型保持距离 */
  white-space: normal;
  word-wrap: break-word;
}

::v-deep(.node-type) {
  white-space: normal;
  word-wrap: break-word;
  text-align: left !important;
}
</style>
