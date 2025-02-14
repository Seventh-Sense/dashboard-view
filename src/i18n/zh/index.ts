import login from './login'
import project from './project'
import menu from './menu'
import dashboard from './dashboard'
import message from './message'
import device from './device'
import msg from './msg'

const global = {
  doc_addr: '文档地址',
  code_addr: '仓库地址',
  form_account: '请输入账号或邮箱',
  form_password: '请输入密码',
  // 头部
  doc: '说明文档',
  help: '帮助中心',
  contact: '关于软件',
  logout: '退出登录',
  // 系统设置
  sys_set: '系统设置',
  lang_set: '语言设置',
  // 功能键
  r_edit: '编辑',
  r_preview: '预览',
  r_copy: '克隆',
  r_rename: '重命名',
  r_publish: '发布',
  r_unpublish: '取消发布',
  r_download: '下载',
  r_delete: '删除',
  r_more: '更多',
  r_add: '新增',
  r_ok: '确认',
  r_cancel: '取消',
  r_save: '保存',
  r_create: '创建',
  r_search: '搜索',
}

export default {
  global,
  login,
  project,
  menu,
  dashboard,
  message,
  device,
  msg,
}
