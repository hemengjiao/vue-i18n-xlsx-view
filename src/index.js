import Vue from 'vue';
import { Select, Input,Option, Upload, Checkbox, CheckboxGroup, Radio, RadioButton, RadioGroup, Button, Table, TableColumn, Tabs, TabPane } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import XlsxToJson from './components/XlsxToJson.vue';

// 注册 Element-UI（可以选择在项目中手动引入）
Vue.use(Select);
Vue.use(Input);
Vue.use(Option);
Vue.use(Upload);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Radio);
Vue.use(RadioButton);
Vue.use(RadioGroup);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tabs);
Vue.use(TabPane);

// 定义 install 方法（用于全局安装组件）
const install = function (Vue) {
    if (install.installed) return;
    install.installed = true;
    Vue.component('XlsxToJson', XlsxToJson);
};

// 自动安装（支持通过 <script> 标签全局引入）
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

// 按需导出组件（支持手动引入）
export { XlsxToJson };

// 默认导出（支持全局注册）
export default {
    install,
};
