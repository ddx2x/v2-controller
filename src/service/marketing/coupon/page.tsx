import { StoreTableProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { merge } from 'lodash';

import { MarketingCouponStateValueEnum, marketingCouponStore } from '@/service/api/marketingCoupon.store';

const defaultStoreTable: StoreTableProps = {
    // toolbarTitle: '折扣列表',
    store: marketingCouponStore,
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
            dataIndex: 'description',
            title: '优惠卷描述',
            hideInSearch: true,
            editable: false,
            fixed: 'left',
            width: 120,
        },
        {
            dataIndex: 'expire_format',
            title: '过期时间',
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
            dataIndex: 'max_claimable',
            title: '最大领取数',
            hideInSearch: true,
            editable: false,
            width: 250,
        },
        {
            dataIndex: 'global_format',
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
            valueEnum: MarketingCouponStateValueEnum,
            width: 250,
        },

    ],
    editableValuesChange: (record: any) => {
    },
    toolBarMenu: (selectedRows: any) => [
        {
            kind: 'link',
            title: '新增',
            link: `/marketing/coupon/add`,
        },
    ],
    tableMenu: (record, action) => [
        {
            kind: 'link',
            title: '编辑',
            link: '/marketing/coupon/edit?id=' + record.uid
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
        marketingCouponStore.next(merge(query, { filter: {}, sort: { version: 1 } }));
    },
};

pageManager.register('marketing.coupon', {
    page: {
        view: [{ kind: 'storeTable', ...defaultStoreTable }],
        container: {
            keepAlive: false,
        },
    },
    stores: [
        {
            store: marketingCouponStore,
            exit: marketingCouponStore.reset,
        },
    ],
});
