import { DescriptionsProps, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { View } from '@/dynamic-view/typing';
import { SearchLabel } from '@/service/search.label';
import { message } from 'antd';
import { commdityAggregateStore, commdityStore } from './store';

const eidt: FormProps = {
  triggerText: '编辑',
  title: '编辑商品',
  layoutType: 'ModalForm',
  columns: [
    {
      title: '商品名称',
      dataIndex: 'sub_title',
    },
  ],
  onSubmit: (form, values) => {
    console.log(values);
    message.success('提交成功');
    return true;
  },
};

const detail: DescriptionsProps = {
  modal: 'Drawer',
  triggerText: '详情',
  columns: [
    {
      title: '文本',
      key: 'text',
      dataIndex: 'id',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '状态',
      key: 'state',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        open: {
          text: '未解决',
          status: 'Error',
        },
        closed: {
          text: '已解决',
          status: 'Success',
        },
      },
    },
    {
      title: '状态2',
      key: 'state2',
      dataIndex: 'state2',
    },
    {
      title: '时间',
      key: 'date',
      dataIndex: 'date',
      valueType: 'date',
    },
    {
      title: 'money',
      key: 'money',
      dataIndex: 'money',
      valueType: 'money',
    },
    {
      title: 'Id',
      key: 'uid',
      dataIndex: 'uid',
    },
    {
      title: '名称',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '名称',
      key: 'name',
      dataIndex: 'name',
      valueType: 'imageUpload',
    },
    {
      title: '操作',
      valueType: 'option',
      render: () => [
        <a target="_blank" rel="noopener noreferrer" key="link">
          链路
        </a>,
        <a target="_blank" rel="noopener noreferrer" key="warning">
          报警
        </a>,
        <a target="_blank" rel="noopener noreferrer" key="view">
          查看
        </a>,
      ],
    },
  ],
};

function getBrandName() {
  console.log('--', '');
  return {
    all: { text: '超长'.repeat(50) },
    open: {
      text: '未解决',
      status: 'Error',
    },
    closed: {
      text: '已解决',
      status: 'Success',
      disabled: true,
    },
    processing: {
      text: '解决中',
      status: 'Processing',
    },
  };
}

// 商品列表
const table: View = {
  kind: 'table',
  rowKey: 'uid',
  toolbar: {
    title: '商品列表',
  },
  columns: [
    {
      dataIndex: 'uid',
      title: '商品标题',
      // width: 150,
      // sorter: true,
    },
    {
      dataIndex: 'sub_title',
      title: '子标题',
      // width: 100,
    },
    {
      dataIndex: 'brand_name',
      title: '品牌',
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: getBrandName(),
    },
  ],
  expand: {
    kind: 'table',
    onDataRender: (record) => commdityStore.api.list(record.uid),
    table: {
      columns: [
        {
          dataIndex: 'name',
          title: '名称',
        },
        {
          dataIndex: 'sale_channels',
          title: '销售渠道',
        },
        {
          dataIndex: 'price',
          title: '价格',
        },
        {
          dataIndex: 'stock',
          title: '库存',
        },
      ],
      moreMenuButton: (record) => [
        {
          kind: 'descriptions',
          collapse: true,
          dataSource: {
            id: '这是一段文本columns',
            date: '20200809',
            money: '1212100',
            state: 'closed',
            state2: 'open',
            ...record,
          },
          ...detail,
        },
      ],
    },
  },
  moreMenuButton: (record) => [
    {
      kind: 'descriptions',
      collapse: true,
      dataSource: {
        id: '这是一段文本columns',
        date: '20200809',
        money: '1212100',
        state: 'closed',
        state2: 'open',
        ...record,
      },
      ...detail,
    },
    { kind: 'form', collapse: true, initialValues: record, ...eidt },
    {
      kind: 'link',
      collapse: true,
      link: `/commdity/list/edit/?uid=${record.uid}&name=${record.name}`,
      title: '全量编辑',
    },
    {
      kind: 'confirm',
      onClick: () => message.info('删除成功'),
      title: '删除',
      text: `确认删除${record.name}`,
    },
    { kind: 'editable', fold: true, title: '表格编辑' },
  ],
  globalSearch: {
    onSearch: (value, setGlobalSearchOptions) => {
      commdityStore.search({ text: value || '', offset: 0, limit: 10 }).then((res) => {
        if (!Array.isArray(res)) {
          return;
        }
        const options = res.map((item) => {
          return {
            label: <SearchLabel key={item.uid} searchObject={item} columns={[]} />,
            value: item.name,
          };
        });
        setGlobalSearchOptions([...options]);
      });
    },
  },
  dataSource: () => commdityAggregateStore.items,
  loading: () => commdityAggregateStore.loading,
  onNext: (actionRef) => commdityAggregateStore.next({ order: { brand_name: 1 } }),
  onSubmit: (params) => commdityAggregateStore.next({ order: { brand_name: 1 } }),
};

pageManager.register('commdity.list', {
  page: { view: [table] },
  stores: [
    {
      store: commdityAggregateStore,
      query: { order: { brand_name: 1 } },
      load: commdityAggregateStore.next,
      exit: commdityAggregateStore.reset,
    },
  ],
});
