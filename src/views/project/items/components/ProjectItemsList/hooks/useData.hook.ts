import { ref } from 'vue'
import { goDialog } from '@/utils'
import { DialogEnum } from '@/enums/pluginEnum'
import { ChartList } from '../../..'
// 数据初始化
export const useDataListInit = () => {
  const list = ref<ChartList>([
    {
      id: 1,
      title: '物料1-假数据不可用',
      release: true,
      label: '官方案例'
    },
    {
      id: 2,
      title: '物料2-假数据不可用',
      release: true,
      label: '官方案例'
    },
    
  ])

  // 添加
  const addHandle = (data: any) => {
    console.log(data)
    list.value.push({ id: data.id, title: data.id, release: true, label: data.id })
  }

  // 删除
  const deleteHandle = (cardData: object, index: number) => {
    goDialog({
      type: DialogEnum.DELETE,
      promise: true,
      onPositiveCallback: () => new Promise(res => setTimeout(() => res(1), 1000)),
      promiseResCallback: (e: any) => {
        window.$message.success('删除成功')
        list.value.splice(index, 1)
      }
    })
  }

  return {
    list,
    addHandle,
    deleteHandle
  }
}
