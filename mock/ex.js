import mockjs from 'mockjs';

export default {
  // 使用 mockjs 等三方库
  'GET /prod/api/v1/Product': (req, res) => {
    const query = req.query;

    var limit = Number(query.limit);
    var per_page = Number(query.per_page || 0);
    var page = Number(query.page || 10);

    var m = {};
    m[`items|${page}`] = [{ 'uid|+1': per_page, name: '@city', 'value|1-100': 50, 'type|0-2': 1 }];

    res.status(200).json(mockjs.mock(m));
  },
};
