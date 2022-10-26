import { TableLayout } from '@/components/kit';
import { TableDropdown } from '@ant-design/pro-components';

export const commodityLabelLayout: TableLayout = {
  columns: [
    { dataIndex: 'name', title: '标签名称' },
    { dataIndex: 'numberOfAssociations', title: '商品库关联数', valueType: 'digit' },
    {
      title: '操作',
      width: 180,
      key: 'option',
      valueType: 'option',
      render: () => [
        <a key="link">链路</a>,
        <a key="link2">报警</a>,
        <a key="link3">监控</a>,
        <TableDropdown
          key="actionGroup"
          menus={[
            { key: 'copy', name: '复制' },
            { key: 'delete', name: '删除' },
          ]}
        />,
      ],
    },
  ],
};
