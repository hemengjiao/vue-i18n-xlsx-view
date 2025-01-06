import XlsxToJson from './components/xlsxToJson.vue'

const install = function (Vue) {
  if (install.installed) return
  install.installed = true
  console.log('初始化插件成功')
  Vue.component('XlsxToJson', XlsxToJson)
}

// 如果全局引入，自动安装插件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// 默认导出（安装插件）
export default {
  install,
}

// 按需导出组件
export { XlsxToJson }
