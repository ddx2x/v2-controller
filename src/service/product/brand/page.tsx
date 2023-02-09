import { StoreTableProps } from '@/dynamic-components/table';
import { pageManager } from '@/dynamic-view';
import { notification } from 'antd';
import { Brand, brandStore } from '../../api/productBrand.store';
import { detail } from './detail'

const brandStoreTable: StoreTableProps = {
  store: brandStore,
  rowKey: 'uid',
  pageSize: 10,
  search: false,
  columns: [
    {
      dataIndex: 'logo_price',
      title: '品牌',
      hideInSearch: true,
      valueType: 'imageUpload',
      editable: false,
      width: 100,
      fixed: 'left',
      fieldProps: {
        width: 55,
      },
    },
    {
      dataIndex: 'uid',
      title: '名称',
      hideInSearch: true,
      editable: false,
    },

    {
      dataIndex: 'first_letter',
      title: '首字母',
      editable: false,
    },
    {
      dataIndex: 'factory_status',
      title: '显示品牌制造商',
      valueType: 'switch',
      hideInSearch: true,
    },
    {
      dataIndex: 'show_status',
      title: '显示品牌',
      hideInSearch: true,
      valueType: 'switch',
    },
    {
      dataIndex: 'product_count',
      title: '商品数',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'product_comment_count',
      title: '评论数',
      hideInSearch: true,
      editable: false,
    },

    {
      dataIndex: 'sort',
      title: '排序',
      hideInSearch: true,
      editable: false,
    },
  ],
  editableValuesChange: (record: Brand) => {
    const src = brandStore.items.find((item) => item.getUid() === record.uid);
    const update: Partial<Brand> = record;

    if (!src) return;
    if (src?.show_status !== update.show_status) {
      if (update.show_status) {
        update.show_status = 1
      } else {
        update.show_status = 0
      }
      brandStore.update_one(src, update, ["show_status"]).then(() =>
        notification.success({ message: "更新成功" })).catch((e) => {
          notification.error({ message: "更新失败:" + e });
        })
    }

    if (src?.factory_status !== update.factory_status) {
      if (update.factory_status) {
        update.factory_status = 1
      } else {
        update.factory_status = 0
      }
      brandStore.update_one(src, update, ["factory_status"]).then(() =>
        notification.success({ message: "更新成功" })).catch((e) => {
          notification.error({ message: "更新失败:" + e });
        })
    }
  },
  toolbarTitle: "数据列表",
  toolBarMenu: (selectedRows) => [
    {
      kind: 'link',
      tag: '新增',
      title: '新增',
      link: `/product/brand/add`,
    },
  ],
  tableMenu: (record, action) => [
    {
      kind: 'descriptions',
      tag: '详情',
      title: '详情',
      dataSource: record,
      ...detail
    },
    {
      kind: 'link',
      tag: '编辑',
      title: '编辑',
      link: '/product/brand/edit?id=' + record.uid
    },
    {
      kind: 'confirm',
      onClick: () => {
        brandStore.remove(record.uid)
          .then(() => notification.success({ message: "删除成功" }))
          .catch((e) => {
            notification.error(e)
          })
      },
      tag: '删除',
      title: '删除',
      text: `确认删除` + record.name,
    },
  ],
  onRowEvent: [
    {
      mouseEvent: 'onDoubleClick',
      tag: '详情',
    },
  ],
  onNext: (params: any) =>
    brandStore.next({
      limit: { page: 0, size: 10 },
      sort: { version: 1 },
      ...params,
    }),
};

pageManager.register('product.brand', {
  page: {
    view: [{ kind: 'storeTable', ...brandStoreTable }],
    container: {
      keepAlive: false,
    }
  },
  stores: [
  ],
});
