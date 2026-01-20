import localforage from 'localforage'

localforage.config({
  name: 'Warehouse', // 数据库名(IndexedDB/WebSQL) | localStorage的key前缀
  version: 1.0,          // 数据库版本
  storeName: 'mainStore',// 仓库名/表名，只能字母+数字+下划线
  description: 'my vue3 project local forage storage', // 描述
  // 自定义存储引擎优先级：按需配置，不配置则默认  IndexedDB → WebSQL → localStorage
  driver: [
    localforage.INDEXEDDB,
    localforage.LOCALSTORAGE,
    localforage.WEBSQL
  ]
})

export default localforage