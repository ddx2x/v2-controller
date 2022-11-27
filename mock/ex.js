import mockjs from 'mockjs';

export default {
  // 使用 mockjs 等三方库
  'GET /prod/api/v1/Product': (req, res) => {
    const query = req.query;
    
    var limit = Number(query.limit);
    var per_page = Number(query.per_page);
    var page = Number(query.page);
    var count = (per_page * (page + 1)) || 1

    res.status(200).json(
      mockjs.mock({
        'items|20': [{ 'uid|+1': count, name: '@city', 'value|1-100': 50, 'type|0-2': 1 }],
      }),
    );
  },
};
