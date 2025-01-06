export default {
  // 格式化多层级数据
  updateDict(obj, keys, value) {
    // eslint-disable-next-line no-eq-null
    if (value == null) value = '' // 针对null和undefined
    if (!keys.includes('.')) {
      obj[keys] = value
      return
    }
    const keyArray = keys.split('.')
    keyArray.reduce((currObj, key, index) => {
      try {
        // 如果是最后一个键，直接赋值
        if (index === keyArray.length - 1) {
          currObj[key] = value
        } else {
          // 确保中间的键是对象
          currObj[key] = currObj[key] || {}
        }
      } catch (e) {
        console.log(key, index, currObj, keyArray, obj);
        console.log('格式化多层级数据 执行失败:', e);
      }
      return currObj[key]
    }, obj)
  },
  convertToArrays(obj) {
    if (Array.isArray(obj)) {
      // 如果是数组，递归处理每个元素
      return obj.map(item => this.convertToArrays(item));
    } else if (typeof obj === 'object' && obj !== null) {
      // 如果是对象，检查其是否包含数字键
      const keys = Object.keys(obj);
      const isNumeric = keys.every(key => !isNaN(Number(key)));
      const numericKeys = isNumeric && keys.map(key => Number(key)).filter(key => !isNaN(key));
      // 检查是否为连续的数组索引
      const isSequentialArray = isNumeric && numericKeys
        .sort((a, b) => a - b) // 按数值排序
        .every((key, index) => key === index);

      // 当前数字为索引, 且上级不是数组格式
      if (isSequentialArray) {
        // 如果是包含数字索引的对象，转换为数组，并递归处理每个元素
        return Object.values(obj).map(item => this.convertToArrays(item))
      } else {
        // 否则递归处理每个属性
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            obj[key] = this.convertToArrays(obj[key]);
          }
        }
      }
    }
    // 如果是基础数据类型，直接返回
    return obj;
  },
}
