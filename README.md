# xlsx-to-json

A Vue 2.x component for converting XLSX files to JSON format, with built-in support for Element-UI.

## Features

- Upload XLSX files and convert them to JSON format.
- Compatible with Vue 2.x.
- Lightweight and easy to integrate.
- Built-in support for Element-UI.

## Installation

Install the package via npm:

```bash
npm install xlsx-to-json
```

## Usage

### 1. Import and Register

In your main JavaScript file:

```javascript
import Vue from 'vue';
import XlsxToJson from 'xlsx-to-json';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.use(XlsxToJson);
```

### 2. Use in Template

In your Vue component:

```vue
<template>
  <div>
    <xlsx-to-json @convert="handleConvert" />
  </div>
</template>

<script>
export default {
  methods: {
    handleConvert(data) {
      console.log('Converted JSON data:', data);
    },
  },
};
</script>
```

### Props

| Prop       | Type   | Default | Description                        |
|------------|--------|---------|------------------------------------|
| `accept`   | String | `.xlsx` | Specifies the accepted file types |

### Events

| Event      | Description                                  |
|------------|----------------------------------------------|
| `convert`  | Emits the converted JSON data as an argument |

## Development

To run the project locally for development:

1. Clone the repository:

   ```bash
   git clone https://github.com/hemengjiao/xlsx-to-json.git
   cd xlsx-to-json
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the project:

   ```bash
   npm run build
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! Please submit issues and pull requests to help improve this project.

## Links

- [Repository](https://github.com/hemengjiao/xlsx-to-json)
- [Issues](https://github.com/hemengjiao/xlsx-to-json/issues)
- [NPM Package](https://www.npmjs.com/package/xlsx-to-json)

