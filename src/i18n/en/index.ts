import login from './login'
import project from './project'
import menu from './menu'
import dashboard from './dashboard'
import message from './message'
import device from './device'
import msg from './msg'

const global = {
  doc_addr: 'Document',
  code_addr: 'Code',
  form_account: 'Please enter your account or email',
  form_password: 'Please enter your password',
  // header
  doc: 'Document',
  help: 'Help',
  contact: 'About Software',
  logout: 'Logout',
  // system setting
  sys_set: 'System Setting',
  lang_set: 'Language Setting',
  // right key
  r_edit: 'Edit',
  r_preview: 'Preview',
  r_copy: 'Clone',
  r_rename: 'Rename',
  r_publish: 'Publish',
  r_unpublish: 'Unpublish',
  r_download: 'Download',
  r_delete: 'Delete',
  r_more: 'More',
  r_add: 'Add',
  r_ok: 'Ok',
  r_cancel: 'Cancel',
  r_save: 'Save',
  r_create: 'Create'
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
