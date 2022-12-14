
import { DescriptionsProps } from '@/dynamic-components';

export const detail: DescriptionsProps = {
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
                // <a target="_blank" rel="noopener noreferrer" key="link">
                //   链路
                // </a>,
                // <a target="_blank" rel="noopener noreferrer" key="warning">
                //   报警
                // </a>,
                // <a target="_blank" rel="noopener noreferrer" key="view">
                //   查看
                // </a>,
            ],
        },
    ],
};
