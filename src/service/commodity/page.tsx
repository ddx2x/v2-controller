import { DescriptionsProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { View } from '@/dynamic-view/typing';
import { SearchLabel } from '@/service/search.label';
import { Col, message, Tag } from 'antd';
import { stringify } from 'querystring';
import { commdityAggregateStore, commdityStore, Commodity } from './store';

// const eidt: FormProps = {
//     triggerText: '编辑',
//     title: '编辑商品',
//     layoutType: 'ModalForm',
//     columns: [
//         {
//             title: '商品名称',
//             dataIndex: 'sub_title',
//         },
//     ],
//     onSubmit: (form, values) => {
//         console.log(values);
//         message.success('提交成功');
//         return true;
//     },
// };

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
            hideInTable: true,
        },
        {
            dataIndex: 'sub_title',
            title: '子标题',
        },
        {
            dataIndex: 'brand_name',
            title: '品牌',
        },
        {
            dataIndex: 'sale_channels',
            title: '销售渠道',
            render: (_, record: Commodity) => (
                <>
                    {record.sale_channels?.map((item) => (
                        <Col>
                            <Tag key={item} >
                                {item == "1" ? "线上" : "线下"}
                            </Tag>
                        </Col>

                    ))}
                </>
            )
        },
    ],
    expand: {
        kind: 'table',
        onDataRender: (record) => commdityStore.api.list(record.uid),
        table: {
            columns: [
                {
                    dataIndex: 'uid',
                    title: 'uid',
                    hideInTable: true,
                },
                {
                    dataIndex: 'name',
                    title: '规格',
                },
                {
                    dataIndex: 'price',
                    title: '价格',
                    valueType: 'money',
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
                {
                    kind: 'link',
                    collapse: true,
                    link: `/commdity/list/edit` + '?' + stringify({ uid: record.uid }),
                    title: '编辑',
                },
                {
                    kind: 'confirm',
                    onClick: () => message.info('删除成功'),
                    title: '删除',
                    text: `确认删除 "${record.uid}" `,
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
        {
            kind: 'link',
            collapse: true,
            link: `/commdity/list/aggregate_edit` + '?' + stringify({ uid: record.uid }),
            title: '编辑',
        },
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
