<template>
  <div id="app">
    <XlsxToJson ref="xlsxToJson" />
  </div>
</template>

<script>
// import XlsxToJson from '../src/components/xlsxToJson.vue'
import '../dist/index.css'
// import { XlsxToJson } from '../dist/vue-i18n-xlsx-view.js'

// console.log('XlsxToJson', XlsxToJson)
export default {
  // components: { XlsxToJson },
  data: () => ({}),
  mounted() {
    // 生成模拟多语言数据
    let zhCn = {}
    let zhTW = {}
    let EN = {}
    let DE = {}
    let IT = {}
    let JA = {}
    for (let i = 1; i <= 1000; i++) {
      zhCn[i] = '中文' + i
      zhTW[i] = '繁体中文' + i
      EN[i] = 'English' + i
      DE[i] = 'Deutsch' + i
      IT[i] = '意大利语' + i
      JA[i] = '日本語' + i
    }

    // 配置项
    let options = {
      // 当前项目名称
      projectName: 'mango',
      // 当前应用编号 - tars [应用目录]下的[应用目录Id]
      // appCode: '1000000839',
      // 基准语言 - json配置转表格列表时与模块列表获取都会以该语言为基准, 请确保该语言是配置最齐全的语言
      baseLang: 'zh-CN',
      // 默认选中语言
      langSelect: ['zh-CN', 'en-US', 'de-DE', 'ja-JP'],
      // 当前默认模块
      module: [],
      // 屏蔽模块 - 字符串,逗号分隔
      shieldingModule: 'el',
      // 语言配置
      langConfig: [
        {
          data: zhCn || {}, // json数据
          lang: 'zh-CN', // 语言关键字
          label: '中文', // 语言名称
        },
        {
          data: EN || {},
          lang: 'en-US',
          label: '英文',
        },
        {
          data: DE || {},
          lang: 'de-DE',
          label: '德文',
        },
        {
          data: IT || {},
          lang: 'it-IT',
          label: '意大利文',
        },
        {
          data: JA || {},
          lang: 'ja-JP',
          label: '日文',
        },
        {
          data: zhTW || {},
          lang: 'zh-TW',
          label: '繁体中文',
        },
      ],
    }

    if (this.$refs.xlsxToJson) {
      this.$refs.xlsxToJson.init(options)
    }
  },
}
</script>

<style>
html,
body {
  margin: 0;
  height: 100%;
  font-family: -apple-system, sans-serif;
}

#app {
  height: 100%;
}

hr {
  border: none;
  border-bottom: 1px solid #cacaca;
  margin-bottom: 1em;
  padding-top: 1em;
  width: 90%;
}
</style>
