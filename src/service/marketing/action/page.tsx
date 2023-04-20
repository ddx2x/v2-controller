import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { merge } from 'lodash';

import { MarketingActionOpValueEnum, marketingActionStore } from '@/service/api/marketingAction.store';

const defaultStoreTable: StoreTableProps = {
    // toolbarTitle: '折扣列表',
    store: marketingActionStore,
    rowKey: 'uid',
    search: false,
    defaultPageSize: 10,
    columns: [
        {
            dataIndex: 'uid',
            hideInSearch: true,
            hideInTable: true,
        },
        {
            dataIndex: 'name',
            title: '优惠卷名称',
            hideInSearch: true,
            editable: false,
            fixed: 'left',
            width: 200,
        },
        {
            dataIndex: 'op',
            title: '操作类型',
            hideInSearch: true,
            editable: false,
            fixed: 'left',
            width: 200,
            valueEnum: MarketingActionOpValueEnum,
        },
        {
            dataIndex: 'value',
            title: '操作值',
            hideInSearch: true,
            editable: false,
            fixed: 'left',
            width: 200,
        },
    ],
    editableValuesChange: (record: any) => {
    },
    toolBarMenu: (selectedRows: any) => [
        {
            kind: 'link',
            title: '新增',
            link: `/marketing/action/add`,
        },
    ],
    tableMenu: (record, action) => [
        {
            kind: 'link',
            title: '编辑',
            link: '/marketing/action/edit?id=' + record.uid
        },
    ],
    onRowEvent: [
        {
            mouseEvent: 'onDoubleClick',
            title: '详情',
        },
    ],
    batchDelete: (selectedRows: any) => console.log('batchDelete', selectedRows),
    onRequest: ({ query }) => {
        marketingActionStore.next(merge(query, { filter: {}, sort: { version: 1 } }));
    },
};

pageManager.register('marketing.action', {
    page: {
        view: [{ kind: 'storeTable', ...defaultStoreTable }],
        container: {
            keepAlive: false,
        },
    },
    stores: [
        {
            store: marketingActionStore,
            exit: marketingActionStore.reset,
        },
    ],
});
