import mockjs from 'mockjs';

export default {
  // 使用 mockjs 等三方库
  'GET /prod/api/v1/Product': mockjs.mock({
    'items|100': [{ 'uid|+1': 1, name: '@city', 'value|1-100': 50, 'type|0-2': 1 }],
  }),
};