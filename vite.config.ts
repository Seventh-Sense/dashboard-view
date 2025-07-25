import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import {
  OUTPUT_DIR,
  brotliSize,
  chunkSizeWarningLimit,
  terserOptions,
  rollupOptions
} from './build/constant'
import viteCompression from 'vite-plugin-compression'
import { viteMockServe } from 'vite-plugin-mock'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import svgLoader from 'vite-svg-loader'
import zipPack, { Options as ZipPickOptions } from 'vite-plugin-zip-pack'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

export default defineConfig({
  base: '/',
  // 路径重定向
  resolve: {
    alias: [
      {
        find: /\/#\//,
        replacement: pathResolve('types')
      },
      {
        find: '@',
        replacement: pathResolve('src')
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js' //解决i8n警告
      }
    ],
    dedupe: ['vue']
  },
  // 全局 css 注册
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        additionalData: `@import "src/styles/common/style.scss";`,
        logger: {
          warn: () => {}
        },
        quietDeps: true
      },
      sass: {
        logger: {
          warn: () => {}
        },
        quietDeps: true
      }
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 排除 iconify 图标影子组件编译报错
          isCustomElement: tag => tag.startsWith('iconify-icon')
        }
      }
    }),
    svgLoader(),
    monacoEditorPlugin({
      languageWorkers: ['editorWorkerService', 'typescript', 'json', 'html']
    }),
    viteMockServe({
      mockPath: '/src/api/mock',
      // 开发打包开关
      localEnabled: true,
      // 生产打包开关
      prodEnabled: true,
      // 打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件
      supportTs: true,
      // 监视文件更改
      watchFiles: true
    })
    // 压缩
    // viteCompression({
    //   verbose: true,
    //   disable: false,
    //   threshold: 10240,
    //   algorithm: 'gzip',
    //   ext: '.gz'
    // })
    // zipPack({
    //   inDir: `dist`,
    //   outDir: './',
    //   outFileName: `dist.zip`
    // })
  ],
  build: {
    target: 'es2020',
    outDir: OUTPUT_DIR,
    //minify: 'terser', // 如果需要用terser混淆，可打开这两行
    //terserOptions: terserOptions,
    rollupOptions: rollupOptions,
    //brotliSize: brotliSize,
    chunkSizeWarningLimit: chunkSizeWarningLimit
  }
})
