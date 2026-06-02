import login from './login'
import project from './project'
import menu from './menu'
import dashboard from './dashboard'
import message from './message'
import device from './device'
import msg from './msg'
import schedule from './schedule'

const global = {
  doc_addr: 'ドキュメント',
  code_addr: 'コード',
  form_account: 'アカウントまたはメールアドレスを入力してください',
  form_password: 'パスワードを入力してください',
  // header
  doc: 'ドキュメント',
  help: 'ヘルプ',
  contact: 'このアプリについて',
  logout: 'ログアウト',
  // system setting
  sys_set: 'システム設定',
  lang_set: '言語設定',
  // right key
  r_edit: '編集',
  r_preview: 'プレビュー',
  r_copy: '複製',
  r_rename: '名前を変更',
  r_publish: '公開',
  r_unpublish: '非公開',
  r_download: 'ダウンロード',
  r_delete: '削除',
  r_more: 'その他',
  r_add: '追加',
  r_ok: 'OK',
  r_cancel: 'キャンセル',
  r_save: '保存',
  r_create: '作成',
  r_search: '検索',
  r_clone: 'コピー'
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
  schedule,
}
