import { useForm } from '@/components/kit/form';
import { TableLayout } from '@/components/kit/table';
import { commodityEdit } from './dialog';

let dataSource = [];
for (let i = 0; i < 3000; i++) {
  dataSource.push({
    name: '全合成发动机油 H6 CTL' + i,
    price: i,
    sales: 166 + i,
    channel: '线上+线下',
    sort: 0,
    availableStatus: true,
  });
}

console.log(dataSource);

export const commodityTableLayout: TableLayout = {
  columns: [
    { dataIndex: 'name', title: '商品名称' },
    { dataIndex: 'price', title: '价格', valueType: 'money' },
    { dataIndex: 'sales', title: '实际销量', valueType: 'digit' },
    { dataIndex: 'channel', title: '销售渠道' },
    { dataIndex: 'createTime', title: '创建时间', valueType: 'dateTime' },
    { dataIndex: 'availableStatus', title: '可售状态', valueType: 'radio' },
    { dataIndex: 'sort', title: '排序', valueType: 'digit' },
    {
      dataIndex: 'option',
      valueType: 'option',
      title: '操作',
      render: (text, record, _, action) => {
        const [editForm] = useForm(commodityEdit);
        return [editForm];
      },
    },
  ],
  dataSource,
};
