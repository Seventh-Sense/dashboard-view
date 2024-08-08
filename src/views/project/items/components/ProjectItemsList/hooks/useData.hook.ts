import { onMounted, ref } from 'vue'
import { goDialog } from '@/utils'
import { DialogEnum } from '@/enums/pluginEnum'
import { ChartList } from '../../..'
import { deleteProject, readProjectList } from '@/api/http'
// 数据初始化
export const useDataListInit = () => {
  const list = ref<ChartList>([])

  const addProject = (data: any) => {
     list.value.push({ id: data.id, title: data.name, release: true, label: data.name })  
  }

  // 添加
  const addHandle = (data: any) => {
    //console.log(data)
    list.value.push({ id: data.id, title: data.id, release: true, label: data.id })
  }

  // 删除
  const deleteHandle = (cardData: any, index: number) => {
    goDialog({
      type: DialogEnum.DELETE,
      promise: true,
      onPositiveCallback: () => new Promise(res => setTimeout(() => res(1), 1000)),
      promiseResCallback: (e: any) => {
        deleteProject(cardData.id)
          .then((res: any) => {
            window.$message.success('删除成功')
            list.value.splice(index, 1)
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
  }

  const deleteAll = () => {
    list.value= []
  }

  return {
    list,
    addProject,
    addHandle,
    deleteHandle,
    deleteAll
  }
}
