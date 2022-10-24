import { useForm } from '@/components/kit/form';
import { TableLayout } from '@/components/kit/table';
import { commodityEdit } from './dialog';

export const CommodityTableLayout: TableLayout = {
  columns: [
    { dataIndex: 'name', title: '商品名称' },
    { dataIndex: 'price', title: '价格', valueType: 'money' },
    { dataIndex: 'channel', title: '销售渠道' },
    { dataIndex: 'createTime', title: '创建时间', valueType: 'dateTime' },
    { dataIndex: 'availableStatus', title: '可售状态', valueType: 'checkbox' },
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
};
