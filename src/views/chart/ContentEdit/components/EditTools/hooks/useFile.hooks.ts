import { ref, nextTick } from 'vue'
import { UploadCustomRequestOptions } from 'naive-ui'
import { FileTypeEnum } from '@/enums/fileTypeEnum'
import { readFile, goDialog, JSONParse } from '@/utils'
import { useSync } from '@/views/chart/hooks/useSync.hook'

export const useFile = () => {
  const importUploadFileListRef = ref()
  const { updateComponent } = useSync()
  const t = window['$t']

  // 上传-前置
  //@ts-ignore
  const importBeforeUpload = ({ file }) => {
    importUploadFileListRef.value = []
    const type = file.file.type
    if (type !== FileTypeEnum.JSON && type !== FileTypeEnum.TXT) {
      window['$message'].warning(t('msg.msg_error_12'))
      return false
    }
    return true
  }

  // 上传-导入
  const importCustomRequest = (options: UploadCustomRequestOptions) => {
    const { file } = options
    nextTick(() => {
      if (file.file) {
        readFile(file.file).then(async (fileData: any) => {
          try {
            fileData = JSONParse(fileData)
            await updateComponent(fileData, true, true)
            window['$message'].success(t('msg.msg_success_1'))
          } catch (error) {
            console.log(error)
            window['$message'].error(t('msg.msg_error_11'))
          }
          // goDialog({
          //   message: '请选择导入方式:',
          //   positiveText: '新增（可撤回）',
          //   negativeText: '覆盖（不可撤回）',
          //   negativeButtonProps: { type: 'info', ghost: false },
          //   // 新增
          //   onPositiveCallback: async () => {
          //     try {
          //       fileData = JSONParse(fileData)
          //       await updateComponent(fileData, false, true)
          //       window['$message'].success('导入成功！')
          //     } catch (error) {
          //       console.log(error)
          //       window['$message'].error('组件导入失败，请检查文件完整性!')
          //     }
          //   },
          //   // 覆盖
          //   onNegativeCallback: async () => {
          //     try {
          //       fileData = JSONParse(fileData)
          //       await updateComponent(fileData, true, true)
          //       window['$message'].success('导入成功！')
          //     } catch (error) {
          //       console.log(error)
          //       window['$message'].error('组件导入失败，请检查文件完整性!')
          //     }
          //   }
          // })
        })
      } else {
        window['$message'].error(t('msg.msg_error_13'))
      }
    })
  }

  return {
    importUploadFileListRef,
    importBeforeUpload,
    importCustomRequest
  }
}
