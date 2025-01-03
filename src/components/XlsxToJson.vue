<div class="xlsxToJson">
<div class="header-title">
  <span>多语言配置xlsx与json转化页</span>
</div>
<!--通用模块-->
<div class="module-box">
  <div class="importRelated" style="margin-bottom: 0">
    <span>基准语言：</span>
    <div class="selectFile">
      <el-radio-group v-model="baseLang" size="small">
        <el-radio-button v-for="item in langColumns" :key="item.label" :label="item.lang">
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="tip">PS: 基准语言会在语言处理时, 做为转换配置标准, 建议使用配置最全面的语言</div>
  </div>
  <div class="importRelated" style="margin-bottom: 0">
    <span>当前处理语言：</span>
    <div class="selectFile">
      <el-checkbox-group v-model="langSelect" size="small" style="line-height: 32px">
        <el-checkbox
            :disabled="[baseLang].includes(item.lang)"
            v-for="item in Object.values(config)"
            :key="item.lang"
            :label="item.lang"
        >
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</div>
<!--导入模块-->
<div class="module-box">
  <h2>多语言 XLSX 转 JSON</h2>
  <div class="leftAndRightLayout">
    <div class="left">
      <div class="importRelated">
        <span>选择xlsx文件：</span>
        <div class="selectFile">
          <el-upload
              action=""
              accept=".xlsx, .xls"
              :auto-upload="false"
              :show-file-list="true"
              :on-change="handle"
              :on-remove="removeHandle"
          >
            <el-button type="primary" size="mini">选择文件</el-button>
          </el-upload>
        </div>
        <div class="tip">
          PS: xlsx转json, 导入表格请使用[语言横版]模板,
          <b class="red">暂不支持[语言竖版]模板</b>
        </div>
      </div>
      <div class="importRelated">
        <div>下载JSON：</div>
        <div class="selectFile">
          <!--下载语言-->
          <span>选择语言:</span>
          <el-select
              multiple
              collapse-tags
              clearable
              filterable
              size="small"
              v-model="downloadLang"
              style="width: 200px; margin-right: 15px"
              placeholder="默认全部语言"
          >
            <el-option
                v-for="item in langColumns"
                :key="item.lang"
                :label="item.label"
                :value="item.lang"
            ></el-option>
          </el-select>

          <!--下载按钮-->
          <el-button type="primary" size="mini" @click="downloadFileHandle">
            下载js文件
          </el-button>
        </div>
      </div>
    </div>
    <div class="right">
      <el-tabs v-model="activeTabName" type="card" size="mini">
        <el-tab-pane :label="lang.label" :name="lang.lang" v-for="lang in langColumns" :key="lang.lang">
          <el-input
              type="textarea"
              v-model="xlsxDataCont[lang.key]"
              placeholder="JSON预览, 请先选择有效翻译表格文件"
          ></el-input>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</div>

<!--导出模块-->
<div class="module-box">
  <h2>多语言 JSON 转 XLSX</h2>
  <!--语言模板-->
  <div class="importRelated">
    <span>使用语言模式：</span>
    <div class="selectFile">
      <el-radio-group v-model="langMode" size="small">
        <el-radio-button v-for="item in langModeOptions" :key="item.value" :label="item.value">
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="tip">
      PS: [语言横版]便于产品/运营翻译或开发转换为JSON; [语言竖版]便于导入
      <!--<a style="color: #107ce8;" href="https://linguist.orangeconnex.com/keyManagement" target="_blank">
        多语言管理平台
      </a>-->
    </div>
  </div>
  <div class="downloadForm">
    <span>选择模块：</span>
    <el-select
        multiple
        collapse-tags
        clearable
        filterable
        v-model="module"
        size="small"
        style="width: 300px;"
        placeholder="默认全部模块"
    >
      <el-option v-for="item in i18nOptions" :key="item" :label="item" :value="item"></el-option>
    </el-select>
    <span></span>
    <el-button type="primary" size="mini" @click="getLanguageConfig">查询列表</el-button>
    <el-button type="primary" size="mini" @click="exportTable">导出表格</el-button>
    <el-button type="primary" size="mini" @click="copyTable">复制表格</el-button>
    <span>屏蔽模块：</span>
    <el-input v-model="shieldingModule" size="small" style="width: 180px;" placeholder="逗号分隔"></el-input>
    <div class="tip">
      PS: 查询出列表后再导出，导出数据/复制表格数据是以当前展示的列表为基础生成的表格文件或数据
    </div>
  </div>
  <el-table
      id="stationTable"
      :data="tableData"
      border
      size="mini"
      style="width: 100%"
      header-row-class-name="isc-table-header"
      cell-class-name="isc-table-cell"
  >
    <el-table-column
        sortable
        v-for="column in tableColumns"
        :key="`tableColumns_${column.prop}`"
        :label="column.label"
        :prop="column.prop"
        :width="column.width"
        :align="column.align"
    >
      <template slot-scope="scope">
        <span v-if="column.prop === 'project'">{{ projectName }}</span>
        <span v-else-if="column.prop === 'index'">{{ scope.$index + 1 }}</span>
        <span v-else>{{ scope.row[column.prop] }}</span>
      </template>
    </el-table-column>
  </el-table>
</div>
</div>

<script>
// 导入用插件
import * as XLSX from 'xlsx/xlsx.mjs'
import { saveAs } from 'file-saver'
import utils from '../utils/utils.js'

export default {
  name: 'xlsxToJson',
  data() {
    return {
      projectName: 'mango', // 项目名称 - 通用配置
      appCode: '', // 当前应用编号 - tars [应用目录]下的[应用目录Id]
      // 语言配置 - 中文和英文必须有(中文用于获取关键字, 英文用于生成)
      config: {},
      // 当前选中语言配置 - 中文和英文必须有
      langSelect: ['zh-CN', 'en-US', 'de-DE', 'ja-JP'],
      // 基准语言 - json配置转列表会以该语言为基准, 请确保该语言是配置最齐全的语言
      baseLang: 'zh-CN',
      // 使用模式: 语言横版/语言竖版, 默认横版: horizontal/vertical
      langMode: 'horizontal',
      langModeOptions: [
        {
          value: 'horizontal',
          label: '语言横版'
        },
        {
          value: 'vertical',
          label: '语言竖版'
        }
      ],

      // 导入表格文件数据
      xlsxFile: null,
      xlsxData: {}, // 导入表格纯列表数据
      xlsxDataCont: {}, // 导入表格转json数据 - 用于生成文件, 或直接展示
      activeTabName: 'zh-CN', // 当前语言 - 展示json数据用
      downloadLang: [], // 下载json文件语言, 默认全部
      isSplitModuleDownload: false, // 是否根据模块拆分下载

      // 表格列表数据
      module: [], // 指定模块
      shieldingModule: '', // 屏蔽模块 - 逗号分隔
      listData: [], // 表格数据
      // 拷贝表格 执行中状态 - 避免重复触发
      copyEvent: false,

      // 根据英文生成关键字时需忽略的语气助词等单词
      word: ['for', 'is', 'the', 'as', 'in', 'he', 'it', 'i']
    }
  },
  computed: {
    // 表格数据
    tableData() {
      let data = []
      let baseLang = this.baseLang
      let listData = this.listData
      let langColumns = this.langColumns

      // 语言模式横版
      if (this.langMode === 'horizontal') {
        data = listData
      } else {
        // 语言模式竖版

        // 原始语言内容
        let baseLangMap = {}
        listData.forEach(item => {
          baseLangMap[item.key] = item[baseLang]
        })

        langColumns.forEach(lang => {
          data = data.concat(
              listData.map(item => {
                return {
                  ...item,
                  appCode: this.appCode, // 应用编码
                  locale: lang.prop, // 语言类型
                  translationContent: item[lang.prop], // 翻译内容
                  baseLang: this.baseLang, // 原始语言(基准语言)
                  baseValue: baseLangMap[item.key], // 原始内容(基准语言)
                  remark: '' // 备注
                }
              })
          )
        })
      }
      // console.log('当前列表数据', data);

      return data
    },
    // 表格配置列表
    tableColumns() {
      let data = []
      // 表格配置 - 横版/竖版
      if (this.langMode === 'horizontal') {
        // 横版格式
        data = [
          {
            type: 'index',
            label: '序号',
            prop: 'index',
            width: 80,
            align: 'center'
          },
          {
            label: '项目',
            prop: 'project',
            align: 'center'
          },
          {
            label: '模块',
            prop: 'module',
            align: 'center'
          },
          /*{
            label: '类型',
            prop: 'type',
            align: 'center',
          },*/
          {
            label: '关键字',
            prop: 'key',
            align: 'center'
          }
        ]
        if (this.config && Object.values(this.config).length) {
          data = data.concat(
              Object.values(this.config)
                  .filter(item => this.langSelect.includes(item.lang))
                  .map(item => {
                    return {
                      key: item.key,
                      lang: item.lang,
                      label: item.label,
                      prop: item.prop,
                      type: 'lang'
                    }
                  })
          )
        }
      } else {
        // 竖版格式
        data = [
          // 应用编码
          /*{
            label: '应用编码',
            prop: 'appCode',
            align: 'center'
          },*/
          // 页面编码
          {
            label: '页面编码',
            prop: 'module',
            align: 'center'
          },
          // 多语言关键字
          {
            label: '翻译key',
            prop: 'key',
            align: 'center'
          },
          // 语言关键字
          {
            label: '语言',
            prop: 'locale'
          },
          // 翻译内容
          {
            label: '翻译内容',
            prop: 'translationContent',
            type: 'lang'
          },
          // 原始语言 - 基准语言
          {
            label: '原始语言',
            prop: 'baseLang'
          },
          // 原始内容 - 基准语言
          {
            label: '原始内容',
            prop: 'baseValue',
            type: 'lang'
          },
          // 备注
          {
            label: '备注',
            prop: 'remark'
          }
        ]
      }

      return data
    },
    // 语言配置列表 - 根据选中配置展示
    langColumns() {
      let list = []
      if (this.config) {
        list = Object.values(this.config).filter(item => this.langSelect.includes(item.lang))
      }
      return list
    },
    // 屏蔽模块 - 根据逗号分割为数组
    shieldingModules() {
      if (this.shieldingModule) {
        return this.shieldingModule.split(',')
      }
      return ''
    },
    // 模块选项
    i18nOptions() {
      let langData = {}
      if (this.baseLang && this.config[this.baseLang]) {
        // console.log('this.config',this.baseLang, this.config);
        langData = this.config[this.baseLang].data
      }
      let data = Object.keys(langData)
      // 屏蔽模块
      if (this.shieldingModules && this.shieldingModules.length) {
        data = data.filter(item => !this.shieldingModules.includes(item))
      }
      // 根据是否选中排序
      data.sort((a, b) => {
        if (this.module.includes(a) && this.module.includes(b)) {
          return this.module.indexOf(a) - this.module.indexOf(b)
        } else if (this.module.includes(a)) {
          return -1
        }
        if (this.module.includes(b)) {
          return 1
        }
        return 0
      })
      return data
    }
  },
  methods: {
    /**
     * @description 初始化
     * @param langConfig: 语言配置, langConfig.lang 语言关键字请注意和多语言管理平台配置的语言关键字匹配
     * @return void
     */
    init({ projectName, appCode, baseLang, langSelect, module, shieldingModule, langConfig }) {
      // 更新项目名称和标题
      this.projectName = projectName || this.projectName
      this.appCode = appCode || this.appCode

      // 更新基准语言和转key语言
      this.baseLang = baseLang || this.baseLang
      // 必须包含基准语言
      if (!this.baseLang) {
        throw new Error('初始化 必须配置基准语言 baseLang')
      }

      // 更新默认选中语言
      this.langSelect = langSelect || this.langSelect
      if (!this.langSelect.includes(this.baseLang)) {
        this.langSelect.push(this.baseLang)
      }

      // 更新模块
      this.module = module || this.module || []
      this.shieldingModule = shieldingModule || this.shieldingModule

      // 清空配置，确保只有父组件传入的 config 会生效
      this.config = {}

      // 遍历并根据传入的配置更新语言信息
      if (langConfig && langConfig.length) {
        // 语言配置必须有基准语言, 否则返回报错
        if (!langConfig.some(lang => lang.lang === this.baseLang)) {
          throw new Error('初始化 语言配置 langConfig 必须包含基准语言:' + this.baseLang)
        }

        // 语言配置格式化
        langConfig.forEach(lang => {
          this.$set(this.config, lang.lang, {
            key: lang.lang,
            data: lang.data || {},
            lang: lang.lang,
            label: lang.label,
            prop: `${lang.lang}` // 自动生成prop
          })
        })
        this.activeTabName = langConfig[0].lang
      } else {
        throw new Error('初始化 必须配置语言配置 langConfig')
      }
    },

    // 深拷贝
    copyJSON(obj) {
      if (obj) {
        return JSON.parse(JSON.stringify(obj))
      }
      return {}
    },
    //文件读取
    readFile(file) {
      return new Promise(resolve => {
        let reader = new FileReader()
        reader.readAsBinaryString(file) //以二进制的方式读取
        reader.onload = ev => {
          resolve(ev.target.result)
        }
      })
    },
    // 清除选中文件触发
    removeHandle() {
      this.xlsxFile = null
      this.xlsxData = {}
      this.xlsxDataCont = {}
    },
    // 选中文件触发
    async handle(ev, fileList) {
      // 已存在选中文件,则清除之前选中的文件
      if (fileList && fileList.length > 1) {
        fileList.splice(0, 1)
      }
      let file = ev.raw
      console.log(file)
      if (!file) {
        console.log('文件打开失败')
        return
      }
      let data = await this.readFile(file)
      let workbook = XLSX.read(data, { type: 'binary' }) //解析二进制格式数据
      console.log('二进制数据的解析:')
      console.log(workbook)
      let worksheet = workbook.Sheets[workbook.SheetNames[0]] //获取第一个Sheet
      let result = XLSX.utils.sheet_to_json(worksheet) //json数据格式
      console.log('最终解析的 json 格式数据:')
      console.log(result)
      // this.xlsxData = result
      this.xlsxFile = file
      this.dataFormat(result)
    },

    // 导入数据格式化
    dataFormat(result) {
      if (!result || !result.length) {
        this.$message.error('请先选择xlsx文件')
        return
      }

      let configMap = {} // 表格配置
      let xlsxData = {} // 语言数据
      this.tableColumns.forEach(item => {
        configMap[item.prop] = item
        if (item.type === 'lang') {
          xlsxData[item.key] = {}
        }
      })

      let path = ''
      result.forEach((item, index) => {
        let langData = {}
        this.langColumns.forEach(lang => {
          langData[lang.key] = item[lang.label]
        })

        let mode = item[configMap['module']['label']] || ''
        // let key = item['关键字'] ? item['关键字'] : this.toCamelCase(enText)
        let key = item[configMap['key']['label']]
        if (key == null || key === '') {
          this.$message.error(`key 不可为空: 第 ${index + 1} 行`)
          throw new Error(`key 不可为空: 第 ${index + 1} 行`)
        }

        // 实时同步模块路径, 用于兼容同一模块数据被不同模块隔离的情况
        // 确保path随时有值, 用于兼容同一模块多行数据仅首行有输入模块名的情况
        if (mode) path = mode

        // eslint-disable-next-line no-eq-null
        /*if (path && xlsxData[this.baseLang][path] == null) {
          Object.keys(xlsxData).forEach(k => {
            xlsxData[k][path] = {}
          })
        }*/
        key = path != null ? path + '.' + key : key
        console.log('当前路径', key);

        this.langColumns.forEach(lang => {
          try {
            if (xlsxData[lang.key] == null) xlsxData[lang.key] = {}
            if (path != null && xlsxData[lang.key][path] == null) xlsxData[lang.key][path] = {}
            // key路径转换为obj对象
            utils.updateDict(xlsxData[lang.key], key, langData[lang.key])
          } catch (e) {
            console.log('执行失败:', e)
          }
        })

        /*Object.keys(xlsxData).forEach(k => {
          try {
            this.updateDict(xlsxData[k], key, langData[k])
          } catch (e) {
            console.log('执行失败:', e)
          }
        })*/
      })

      console.log('转换前xlsxData', xlsxData);
      /*this.langColumns.forEach(lang => {
        xlsxData[lang.lang] = linguist.transformComplexData(xlsxData[lang.lang])
      })*/

      // 数字索引的数据需要转换为数组格式
      this.xlsxData = utils.convertToArrays(xlsxData)
      console.log('转换后xlsxData', this.xlsxData);

      let xlsxDataCont = {}
      Object.keys(xlsxData).forEach(k => {
        xlsxDataCont[k] = 'export default ' + JSON.stringify(xlsxData[k])
      })
      this.xlsxDataCont = xlsxDataCont
    },
    // 获取驼峰关键字
    toCamelCase(str) {
      if (!str) return ''
      let name = str
          .split(' ')
          .filter(s => s && !this.word.includes(s.toLowerCase()))
          .join(' ')
      if (!name) return ''

      const s = name
          .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          .map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
          .join('')
      return s.slice(0, 1).toLowerCase() + s.slice(1)
    },
    // 下载指定语言文件
    downloadFileHandle() {
      if (!this.xlsxFile) {
        this.$message.error('请先选择xlsx文件')
        return
      }

      // this.language = language
      let langData = {}

      if (this.downloadLang && this.downloadLang.length) {
        this.downloadLang.forEach(lang => {
          langData[lang] = this.copyJSON(this.xlsxData[lang])
        })
      } else {
        langData = this.copyJSON(this.xlsxData)
      }

      let content = 'export default ' + JSON.stringify(langData)
      this.downloadFile(content, '多语言JSON')
    },
    // 下载文件
    downloadFile(content, name) {
      let blob = new Blob([content], {
        type: 'text/plain;charset=utf-8'
      })
      // console.log(json, blob)
      saveAs(blob, name + '.js')
    },

    // 位数补齐 - 比如设置4位, 数据12, 自动补齐0012
    pad(num, n) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },

    // 导出表格
    exportTable() {
      if (!this.listData || !this.listData.length) {
        this.$message.info('请先查询列表数据')
        return
      }
      let date = new Date()
      // 文件名称 - 需要拼接年月日时分秒
      let name = this.projectName
      // 需要拼接当前为横版还是竖版 langMode: 'horizontal',
      name += this.langMode === 'horizontal' ? '横版' : '竖版'
      name += '多语言_'
      let times = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()]
      times = times.map((t, i) => this.pad(t, i===0 ? 4 : 2))
      name += times.join('')

      this.exportData({
        dom: 'stationTable', // 需要导出表格的dom id
        name // 导出文件名称
      })
    },
    exportData({ dom, name }) {
      let excelName = name + '.xlsx'
      let xlsxParam = { raw: true } //转换成excel时，使用原始的格式
      // 克隆节点
      let tables = document.getElementById(dom).cloneNode(true)
      // 判断是否为固定列，解决（为固定列时，会重复生成表格）
      if (tables.querySelector('.el-table__fixed') !== null) {
        tables.removeChild(tables.querySelector('.el-table__fixed'))
      }
      let table_book = XLSX.utils.table_to_book(tables, xlsxParam)
      let table_write = XLSX.write(table_book, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        saveAs(new Blob([table_write], { type: 'application/octet-stream' }), excelName)
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, table_write)
      }
      return table_write
    },

    // 复制表格
    copyTable() {
      if (!this.listData || !this.listData.length) {
        this.$message.info('请先查询列表数据')
        return
      }
      if (this.copyEvent) {
        this.$message.info('拷贝中, 请等待!')
        return
      }
      this.copyEvent = true
      // document.execCommand('copy')
      this.copyData()
    },
    // 拷贝内容
    copyData() {
      if (this.copyEvent) {
        // 拼接数据 '类型',
        const first = this.tableColumns
            .map(item => {
              return item.label
            })
            .join('\t')

        const sec = this.tableData
            .map((item, i) => {
              let data = ''
              this.tableColumns.forEach((col, index) => {
                if (index) data += '\t'
                if (col.type === 'lang') {
                  data += `${this.formattedText(item[col.prop])}`
                } else if (col.prop === 'index') {
                  data += `${i + 1}`
                } else if (col.prop === 'appCode') {
                  data += `${this.appCode}`
                } else if (col.prop === 'project') {
                  data += `${this.projectName}`
                } else {
                  data += `${item[col.prop]}`
                }
              })
              return data
            })
            .join('\n')

        const selection = `${first}\n${sec}`
        this.copyText(selection.toString())
        this.$message.success('复制成功')
        this.copyEvent = false
      }
    },
    // 拷贝文案 - 支持换行
    copyText(value) {
      // 动态创建 textarea 标签
      const textarea = document.createElement('textarea')
      // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
      textarea.readOnly = 'readonly'
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      // 将要 copy 的值赋给 textarea 标签的 value 属性
      // 网上有些例子是赋值给innerText,这样也会赋值成功，但是识别不了\r\n的换行符，赋值给value属性就可以
      textarea.value = value
      // 将 textarea 插入到 body 中
      document.body.appendChild(textarea)
      // 选中值并复制
      textarea.select()
      textarea.setSelectionRange(0, textarea.value.length)
      document.execCommand('Copy')
      document.body.removeChild(textarea)
    },
    // 文本格式化 - 清除换行
    formattedText(str = '') {
      if (typeof str !== 'string') return str
      return str.replace(/\r|\n/gi, '')
    },

    // 获取配置列表
    getLanguageConfig() {
      // console.log(zhCn)
      let listData = []
      let moduleList = this.module && this.module.length > 0 ? this.module : this.i18nOptions
      moduleList.forEach(module => {
        // 获取语言对应模块数据配置
        let langData = {}
        this.langColumns.forEach(lang => {
          langData[lang.key] = lang.data[module] || ''
        })

        if (langData[this.baseLang]) {
          let data = []
          // console.log(Object.keys(cn))
          this.formatLanguage(langData, {}, data)
          data = data.map(v => {
            v.module = module
            if (v.key == null || v.key === '') v.key = module
            // v.key = v.key ? module + '.' + v.key : module
            return v
          })
          // console.log(data)

          listData = listData.concat(data)
        }
      })

      this.listData = listData
    },

    // 多语言格式化 - 以cn为主
    formatLanguage(langData, a = {}, data = []) {
      // 获取基准语言配置
      let baseLang = langData[this.baseLang]
      if (baseLang) {
        // console.log('当前内容', langData);
        if (typeof baseLang === 'object') {
          Object.keys(baseLang).forEach(type => {
            let baseText = baseLang ? baseLang[type] : '' // 用于关键字获取

            // 当前路径下语言获取
            let langText = {}
            this.langColumns.forEach(lang => {
              langText[lang.key] = langData[lang.key] ? langData[lang.key][type] : ''
            })

            let b = { ...a }
            b.key = a.key ? a.key + '.' + type : type

            if (typeof baseText === 'object') {
              // console.log(type, baseText)
              if (!b.type) b.type = type
              // console.log('递归对象', typeof baseText === 'object', type, baseText)
              this.formatLanguage(langText, b, data)
            } else {
              b.type = a.type

              this.langColumns.forEach(lang => {
                if (langText[lang.key] != null) {
                  b[lang.prop] = langText[lang.key]
                } else {
                  b[lang.prop] = ''
                }
              })

              // b.module = this.module
              data.push(b)
            }
          })
        } else {
          // 当前路径下语言获取
          let langText = {}
          this.langColumns.forEach(lang => {
            langText[lang.key] = langData[lang.key]
          })

          let b = { ...a }

          b.type = a.type

          this.langColumns.forEach(lang => {
            b[lang.prop] = langText[lang.key] || ''
          })

          // b.module = this.module
          data.push(b)
        }
      }
    }
  },
  created() {},
  mounted() {

    /*// TODO 调试
    let data = {
      "bindFailed": {
        error: {
          '0': {
            '5': '1111',
            '400206': '2222',
            '400203': '3333',
            '400205': '4444',
          }
        },
        "rebind": "Erneut versuchen",
      },
    }
    data = utils.convertToArrays(data)
    console.log('转换后的值', data);*/
  }
}
</script>

<style lang="scss" scoped>
.xlsxToJson {
  padding: 20px 40px;

  .header-title {
    font-size: 20px;
    font-weight: 700;
  }
  .module-box {
    padding-left: 20px;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 18px;
    font-weight: 700;
  }

  .leftAndRightLayout {
    display: flex;
    justify-content: space-between;

    .right {
      min-width: 800px;

      ::v-deep {
        .el-textarea {
          textarea {
            min-height: 200px !important;
            font-size: 14px;
          }
        }

        .el-tabs {
          margin-top: 15px;
          height: 100%;

          &__header {
            margin-bottom: 0;
          }

          .el-tabs__item {
            height: 28px;
            line-height: 28px;
            font-size: 14px;
            font-weight: 400;
          }

          .el-tabs__item.is-active {
            background: rgba(236, 105, 36, 0.15);
            border-radius: 4px 4px 0 0;
            color: rgba(0, 0, 0, 0.85);
          }
        }
      }
    }
  }

  .tip {
    color: #999999;
    font-size: 14px;
  }

  .red {
    color: red !important;
  }

  .importRelated {
    margin-bottom: 20px;
    margin-top: 20px;
    font-size: 14px;

    span {
      display: inline-block;
      vertical-align: top;
      line-height: 28px;
    }

    .selectFile {
      display: inline-block;
    }

    .downloadFile {
      margin-top: 20px;
    }
  }

  .downloadForm {
    font-size: 14px;
    margin-bottom: 20px;
  }

  ::v-deep {
    .el-table {
      border-bottom: 1px solid #dddddd;

      th,
      td {
        height: 20px;
        padding: 0;
      }

      .cell {
        line-height: 20px;
      }

      th {
        height: 28px;
      }
    }
  }
}
</style>
