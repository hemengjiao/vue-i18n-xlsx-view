# vue-i18n-xlsx-view

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-blue)](https://nodejs.org/)
[![Vue 2](https://img.shields.io/badge/Vue.js-2.6%2B-brightgreen)](https://v2.vuejs.org/)
[![Element UI](https://img.shields.io/badge/Element--UI-2.13%2B-orange)](https://element.eleme.io/)

`vue-i18n-xlsx-view` 是一个专为 Vue 2 框架设计的多语言 JSON 与表格互转的可视化组件，旨在简化和优化多语言数据的管理和编辑。

## 特性

- **JSON 与 xlsx 互转**：支持将 JSON 格式的多语言文件导出为表格或从表格导入生成 JSON。
- **直观的 UI 界面**：提供用户友好的界面，支持在线预览多语言数据, 自己选择相关配置。
- **高效的多语言管理**：轻松处理多语言项目中的复杂数据。
- **兼容性好**：专为 Vue2 设计，适配各种 Vue2 项目。

## 效果

![img](https://private-user-images.githubusercontent.com/193553894/400344351-d7e3dcf0-2dfb-463b-a166-9dc57617f5e5.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzYxNTA0ODcsIm5iZiI6MTczNjE1MDE4NywicGF0aCI6Ii8xOTM1NTM4OTQvNDAwMzQ0MzUxLWQ3ZTNkY2YwLTJkZmItNDYzYi1hMTY2LTlkYzU3NjE3ZjVlNS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwMTA2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDEwNlQwNzU2MjdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1iZjVmZjFkZjk2NjRmMzRiNTVlNjc1NjJiZjgwMjQyZDg5ZGRjOWEwMDRlZTkyMjdmMDFlNTkyZWQzNGNhYWFiJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.exbRqPsS_HSumh2tin0y9sIica-5QU1ByjIzE9rN0tI)

## 安装

```bash
npm install vue-i18n-xlsx-view --save
```

## 使用方法

### 依赖第三方框架和UI插件
[![Vue 2](https://img.shields.io/badge/Vue.js-2.6%2B-brightgreen)](https://v2.vuejs.org/)
[![Element UI](https://img.shields.io/badge/Element--UI-2.13%2B-orange)](https://element.eleme.io/)


- 请确保消费项目有引入 **vue@2.6+** 和 **element-ui@2.13+**
- 按需引入需要至少包含以下组件:
  Select, Input,Option, Upload, Checkbox, CheckboxGroup, Radio, RadioButton, RadioGroup, Button, Table, TableColumn, Tabs, TabPane


### 全局引入

在主入口文件（如 `main.js`）中引入并注册：

```javascript
import Vue from 'vue'
import 'vue-i18n-xlsx-view/dist/index.css'
import VueI18nXlsxView from 'vue-i18n-xlsx-view'

Vue.use(VueI18nXlsxView)
```

### 按需引入

在需要的组件或入口（如 `main.js`）中引入并注册：

```javascript
import Vue from 'vue'
import 'vue-i18n-xlsx-view/dist/index.css'
import { XlsxToJson } from 'vue-i18n-xlsx-view'

// 注册组件
Vue.component(XlsxToJson)
```

### 组件内使用

在需要的组件中直接使用：

```vue
<template>
  <div>
    <xlsx-to-json ref="xlsxToJson" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      jsonData: {
        // 语言层级, 必须有, 语言关键字可自定义
        'en-US': {
          // 模块层级, 必须有, 自定义关键字
          greeting: {
            // key 层级, 必须有, 可为Object/String等常规类型, 但不建议包含Array类型
            hello: 'Hello'
          },       
          farewell: {
            goodbye: 'Goodbye'
          }
        },
        'zh-CN': {
          greeting: {
            hello: '你好'
          },          
          farewell: {
            goodbye: '再见'
          }
        }
      }
    };
  },
  
  mounted() {
    // 配置项
    let options = {
      // 当前项目名称
      projectName: 'xxx',
      // 基准语言 - json配置转表格列表时与模块列表获取都会以该语言为基准, 请确保该语言是配置最齐全的语言
      baseLang: 'zh-CN',
      // 默认选中语言
      langSelect: ['zh-CN', 'en-US'],
      // 当前默认模块
      module: [],
      // 屏蔽模块 - 字符串,逗号分隔
      shieldingModule: 'el',
      // 语言配置
      langConfig: [
        {
          data: this.jsonData.zh || {}, // json数据
          lang: 'zh-CN', // 语言关键字
          label: '中文', // 语言名称
        },
        {
          data: this.jsonData.en || {},
          lang: 'en-US',
          label: '英文',
        },
      ],
    }
    // 初始化
    this.$refs.xlsxToJson.init(options)
  }
};
</script>

<style scoped>
/* 可根据需求自定义样式 */
</style>
```

## init初始化函数入参options属性

| 属性名      | 类型     | 默认值 | 描述                                                                       |
| ----------- | -------- | ------ |--------------------------------------------------------------------------|
| `projectName`   | String    | `''`   | 当前项目的名称，用于区分不同项目的多语言配置, 导出表格时, 会使用该配置。                                   |
| `baseLang`      | String    | `'zh-CN'`| 基准语言，用于转换 JSON 到表格时的参考语言，建议选择包含完整数据的语言。                                  |
| `langSelect`    | Array     | `[]`   | 默认选中的语言列表，按需选择需要显示的语言，例如 `['zh-CN', 'en-US']`。                           |
| `module`        | Array     | `[]`   | 当前默认的模块，用于选择要显示的语言模块。                                                    |
| `shieldingModule`| String   | `''`   | 屏蔽的模块，支持逗号分隔的字符串，用于隐藏不需要展示的模块或语言, 比如element-ui的el模块。                     |
| `langConfig`    | Array     | `[]`   | 语言配置数组，包含语言数据、语言关键字及其标签，例如 `{ data: zhCn, lang: 'zh-CN', label: '中文' }`。 |
| `langConfig.lang`| String   | `''`   | 语言的关键字，用于指定该配置项对应的语言标识符。                                                 |
| `langConfig.label`| String  | `''`   | 显示的语言名称。                                                                 |
| `langConfig.data`| Object   | `{}`   | 当前语言对应的 JSON 数据，包含该语言的键值对翻译内容, 需要注意按模块划分。                                |
| `platformUrl`| String   | `''`     | 多语言远程管理平台地址, 导入竖版模版的平台.                                                  |

## 开发与贡献

欢迎为本插件贡献代码或提出建议！

### 本地开发

1. 克隆代码库：
   ```bash
   git clone https://github.com/your-repo/vue-i18n-xlsx-view.git
   ```
2. 安装依赖：
   ```bash
   npm install
   ```
3. 启动开发环境：
   ```bash
   npm run serve
   ```

## 许可证

[MIT](LICENSE)

## 联系方式

如果在使用过程中遇到问题或有改进建议，可以通过以下方式联系：

- **GitHub Issues**: [提交问题](https://github.com/hemengjiao/vue-i18n-xlsx-view/issues)
- **Email**: mengjiao.he@itiaoling.com
