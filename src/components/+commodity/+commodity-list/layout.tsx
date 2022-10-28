import { TableLayout } from '@/components/+app';
import { useStepsForm } from '@/components/kit/form';
import { expanded } from '@/components/kit/table';
import { Badge, message, TableColumnsType } from 'antd';
import { commodityEdit } from './dialog';

let data = [];
for (let i = 0; i < 30; i += 1) {
  data.push({
    key: i,
    name: '全合成发动机油 H6 CTL',
    price: 100,
    sales: 166,
    channel: '线上+线下',
    sort: 0,
    availableStatus: true,
  });
}

const ecolumns: TableColumnsType<any> = [
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Status',
    key: 'state',
    render: () => (
      <span>
        <Badge status="success" />
        Finished
      </span>
    ),
  },
  { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
];

const edata = [];
for (let i = 0; i < 3; ++i) {
  edata.push({
    key: i.toString(),
    date: '2014-12-24 23:12:00',
    name: 'This is production name',
    upgradeNum: 'Upgraded: 56',
  });
}

export const commodityTableLayout: TableLayout = {
  pageContainer: {
    header: {
      title: '商品列表',
    },
  },
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
        const [editForm] = useStepsForm(commodityEdit);
        return [editForm];
      },
    },
  ],
  dataSource: data,
  expandable: expanded({ columns: ecolumns, dataSource: edata, rowRender: 'table' }),
  onLoading: () => {
    message.info('数据加载中.....');
  },
};
