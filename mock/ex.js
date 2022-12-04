import mockjs from 'mockjs';

export default {
  // 使用 mockjs 等三方库
  'GET /prod/api/v1/commodity': (req, res) => {
    const query = req.query;

    var limit = Number(query.limit);
    var size = Number(query.size || 10);
    var page = Number(query.page || 0);

    var m = {};
    m[`items|${size}`] = [{ 'uid|+1': page, name: '@city', 'value|1-100': 50, 'type|0-2': 1 }];

    res.status(200).json(mockjs.mock(m));
  },
};
