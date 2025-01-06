import Vue from 'vue'

import {
  Select,
  Input,
  Option,
  Upload,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioButton,
  RadioGroup,
  Button,
  Table,
  TableColumn,
  Tabs,
  TabPane,
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 注册 Element-UI（可以选择在项目中手动引入）
Vue.use(Select)
Vue.use(Input)
Vue.use(Option)
Vue.use(Upload)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Radio)
Vue.use(RadioButton)
Vue.use(RadioGroup)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tabs)
Vue.use(TabPane)

import 'vue-i18n-xlsx-view/dist/index.css'
import VueI18nXlsxView from 'vue-i18n-xlsx-view'

console.log('插件', VueI18nXlsxView)
// 使用默认导出
Vue.use(VueI18nXlsxView)

Vue.config.productionTip = false

import Dev from './Dev.vue'

new Vue({
  render: (h) => h(Dev),
}).$mount('#app')
