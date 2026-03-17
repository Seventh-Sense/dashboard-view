import login from './login'
import project from './project'
import menu from './menu'
import dashboard from './dashboard'
import message from './message'
import device from './device'
import msg from './msg'

const global = {
  doc_addr: '文件位址',
  code_addr: '儲存庫位址',
  form_account: '請輸入帳號或電子信箱',
  form_password: '請輸入密碼',
  // 头部
  doc: '說明文件',
  help: '說明中心',
  contact: '關於軟體',
  logout: '登出',
  // 系统设置
  sys_set: '系統設定',
  lang_set: '語言設定',
  // 功能键
  r_edit: '編輯',
  r_preview: '預覽',
  r_copy: '複製',
  r_rename: '重新命名',
  r_publish: '發布',
  r_unpublish: '取消發布',
  r_download: '下載',
  r_delete: '刪除',
  r_more: '更多',
  r_add: '新增',
  r_ok: '確認',
  r_cancel: '取消',
  r_save: '儲存',
  r_create: '建立',
  r_search: '搜尋',
  r_clone: '複製'
}

export default {
  global,
  login,
  project,
  menu,
  dashboard,
  message,
  device,
  msg
}
