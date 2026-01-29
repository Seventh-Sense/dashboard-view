import { onMounted, ref } from 'vue'
import { goDialog, setLocalStorage } from '@/utils'
import { DialogEnum } from '@/enums/pluginEnum'
import { ChartList } from '../../..'
import { deleteProject, readProjectList } from '@/api/http'
import localforage from '@/utils/localforage'

const list = ref<ChartList>([])

// 数据初始化
export const useDataListInit = () => {
  const t = window['$t']

  const addProject = (data: any) => {
    list.value.push({
      id: data.id,
      title: data.name,
      release: true,
      label: data.name,
      image: data.cover,
      time: data.time,
      type: data.description
    })
  }

  // 添加
  const addHandle = (data: any) => {
    list.value.push({
      id: data.id,
      title: data.id,
      release: true,
      label: data.id,
      type: data.description
    })
  }

  // 删除
  const deleteHandle = (cardData: any, index: number) => {
    goDialog({
      type: DialogEnum.DELETE,
      promise: true,
      onPositiveCallback: () => new Promise(res => setTimeout(() => res(1), 1000)),
      promiseResCallback: (e: any) => {
        deleteProject(cardData.id)
          .then(async (res: any) => {
            window.$message.success(t('project.msg_del_success'))
            list.value.splice(index, 1)
            //同步缓存
            const data: any = await localforage.getItem('ProjectList')
            if (Array.isArray(data) && data.length > 0) {
              const newData = data.filter((item: any) => item.id !== cardData.id)
              await localforage.setItem('ProjectList', newData)
              setLocalStorage('ProjectInfo', list.value)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
  }

  const deleteAll = async () => {
    list.value = []
    setLocalStorage('ProjectInfo', [])
    await localforage.setItem('ProjectList', [])
  }

  const renameHandle = (data: { id: any; name: any }) => {
    const targetItem = list.value.find(item => item.id === data.id)

    if (targetItem) {
      const newName = data.name
      targetItem.label = newName
      targetItem.title = newName
    }
  }

  return {
    list,
    addProject,
    addHandle,
    deleteHandle,
    deleteAll,
    renameHandle
  }
}
