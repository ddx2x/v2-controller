import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { merge } from 'lodash';
import {
    MarketingActivityStateValueEnum,
    marketingActivityStore,
} from '../../api/marketingActivity.store';

const defaultStoreTable: StoreTableProps = {
    // toolbarTitle: '折扣列表',
    store: marketingActivityStore,
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
            title: '活动名称',
            hideInSearch: true,
            editable: false,
            fixed: 'left',
            width: 200,
        },
        {
            dataIndex: 'description',
            title: '活动描述',
            hideInSearch: true,
            editable: false,
            fixed: 'left',
            width: 120,
        },
        {
            dataIndex: 'start_time_format',
            title: '活动开始时间',
            hideInSearch: true,
            editable: false,
            width: 250,
        },
        {
            dataIndex: 'end_time_format',
            title: '活动结束时间',
            hideInSearch: true,
            editable: false,
            width: 250,
        },
        {
            dataIndex: 'merchant',
            title: '创建商户',
            hideInSearch: true,
            editable: false,
            width: 250,
        },

        {
            dataIndex: 'global',
            title: '是否全局',
            hideInSearch: true,
            editable: false,
            width: 250,
        },
        {
            dataIndex: 'state',
            title: '状态',
            editable: false,
            valueType: 'select',
            hideInSearch: true,

            valueEnum: MarketingActivityStateValueEnum,
        },

    ],
    editableValuesChange: (record: any) => {
    },
    toolBarMenu: (selectedRows: any) => [

    ],

    onRowEvent: [
        {
            mouseEvent: 'onDoubleClick',
            title: '详情',
        },
    ],
    batchDelete: (selectedRows: any) => console.log('batchDelete', selectedRows),
    onRequest: ({ query }) => {
        marketingActivityStore.next(merge(query, { filter: {}, sort: { version: 1 } }));
    },
};

pageManager.register('marketing.activity', {
    page: {
        view: [{ kind: 'storeTable', ...defaultStoreTable }],
        container: {
            keepAlive: false,
        },
    },
    stores: [
        {
            store: marketingActivityStore,
            exit: marketingActivityStore.reset,
        },
    ],
});
