import path from 'path';
import { fileURLToPath } from 'url';
import { VueLoaderPlugin } from 'vue-loader';

// 获取当前文件的目录名
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'production', // 设置生产模式
  entry: './src/index.js', // 插件入口文件
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js', // 输出为 ESM 文件
    library: {
      type: 'module', // 指定输出格式为 ESM
    },
  },
  experiments: {
    outputModule: true, // 启用 ESM 支持
  },
  externals: {
    vue: 'Vue', // 将 Vue 作为外部依赖
    'element-ui': 'ELEMENT', // 将 Element-UI 作为外部依赖
  },
  module: {
    rules: [
      {
        test: /\.vue$/, // 处理 .vue 文件
        loader: 'vue-loader',
      },
      {
        test: /\.js$/, // 处理 .js 文件
        exclude: /node_modules/,
        use: 'babel-loader', // 使用 Babel 编译 JS
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // 处理 CSS
      },
      {
        test: /\.scss$/, // 处理 SCSS 文件
        use: ['vue-style-loader', 'css-loader', 'sass-loader'], // 使用 Dart Sass
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // 处理图片资源
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]',
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(), // Vue 解析插件
  ],
  resolve: {
    extensions: ['.js', '.vue'], // 自动解析扩展名
  },
};
