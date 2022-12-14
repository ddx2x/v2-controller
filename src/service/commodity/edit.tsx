import { pageManager, View } from '@/dynamic-view';
import { ProFormColumnsType, StepFormProps } from '@ant-design/pro-components';
import { parse } from 'querystring';

let steps: StepFormProps[] = [
    { title: '基本信息' },
    { title: '交付设置' },
    { title: '图文详情' }
]

let commodityType: ProFormColumnsType = {
    title: '商品类型',
    dataIndex: 'types',
    valueType: 'radio',
    initialValue: 1,
    valueEnum: {
        1: '实物商品（物流发货）',
        2: '实物商品（跨境海淘）',
        3: '虚拟商品 （通用）',
        4: '虚拟商品 （付费券）',
    },
    formItemProps: {
        rules: [
            {
                required: true,
                message: '此项为必填项',
            },
        ],
    },
};

let salesChannels: ProFormColumnsType = {
    title: '销售渠道',
    dataIndex: 'salesChannels',
    valueType: 'checkbox',
    initialValue: [],
    valueEnum: {
        1: '线上销售',
        2: '线下销售',
    },
    formItemProps: {
        rules: [
            {
                required: true,
                message: '此项为必填项',
            },
        ],
    },
};

let salesModel: ProFormColumnsType = {
    title: '销售模式',
    dataIndex: 'salesModel',
    valueType: 'radio',
    initialValue: 1,
    valueEnum: {
        1: '现货销售',
        2: '预售模式（商家设置商品预售数量，各门店需自行修改预售数量）',
        3: '抽签模式',
    },
    formItemProps: {
        rules: [
            {
                required: true,
                message: '此项为必填项',
            },
        ],
    },
};

let commodityName: ProFormColumnsType = {
    title: '商品名称',
    dataIndex: 'name',
    valueType: 'text',
    width: '400px',
    fieldProps: {
        placeholder: '请输入商品的名称',
    },
    formItemProps: {
        rules: [
            {
                required: true,
                message: '此项为必填项',
            },
        ],
    },
};

let commodityPrice: ProFormColumnsType = {
    title: '商品图片',
    dataIndex: 'images',
    valueType: 'imageUpload',
    tooltip: '尺寸建议750x750像素以上，大小2M以下，最多5张 (可拖拽图片调整显示顺序)',
    fieldProps: {
        name: 'upload',
        action: '/api/images/upload',
    },
};

let deliveryMethod: ProFormColumnsType = {
    title: '配送方式',
    dataIndex: 'deliveryMethod',
    initialValue: [1, 2],
    valueType: 'checkbox',
    valueEnum: {
        1: '商家配送',
        2: '到店自提',
    },
    formItemProps: {
        rules: [
            {
                required: true,
                message: '此项为必填项',
            },
        ],
    },
};

export const singleAddView: View = {
    kind: 'stepForm',
    mount: (location, formRef) => {
        console.log('location?.search', location?.search, formRef);
        let data = location?.search.split("?")[1] || "";
        console.log("parse ", parse(data));
        location?.search &&
            formRef.current?.setFieldsValue({})
    },

    unMount: (location, formRef) => {
        formRef.current?.resetFields()
    },
    steps: steps,
    columns: [
        [
            commodityName,
            commodityType,
            salesChannels,
            salesModel,
            commodityPrice,
        ],
        [deliveryMethod],
        [],
    ],
};

pageManager.register('commdity.list.add', {
    page: {
        view: [singleAddView],
        container: {
            keepAlive: true,
            header: {
                title: '单品新增',
            },
        }
    },
    stores: [],
});


export const singleEditView: View = {
    kind: 'stepForm',
    mount: (location, formRef) => {
        console.log('location?.search', location?.search, formRef);
        let data = location?.search.split("?")[1] || "";
        console.log("parse ", parse(data));
        location?.search &&
            formRef.current?.setFieldsValue({})
    },

    unMount: (location, formRef) => {
        formRef.current?.resetFields()
    },

    steps: steps,
    columns: [
        [
            commodityName,
            commodityType,
            salesChannels,
            salesModel,
            commodityPrice,
        ],
        [deliveryMethod],
        [],
    ],
};

pageManager.register('commdity.list.edit', {
    page: {
        view: [singleEditView],
        container: {
            keepAlive: false,
            header: {
                title: '单品编辑',
            },
        }
    },
    stores: [],
});



export const aggregateAddView: View = {
    kind: 'stepForm',
    mount: (location, formRef) => {
        console.log('location?.search', location?.search, formRef);
        let data = location?.search.split("?")[1] || "";
        console.log("parse ", parse(data));
        location?.search &&
            formRef.current?.setFieldsValue({})
    },

    unMount: (location, formRef) => {
        formRef.current?.resetFields()
    },

    steps: steps,
    columns: [
        [
            commodityName,
            commodityType,
            salesChannels,
            salesModel,
            commodityPrice,
        ],
        [deliveryMethod],
        [],
    ],
};

pageManager.register('commdity.list.aggregate_add', {
    page: {
        view: [aggregateAddView],
        container: {
            keepAlive: false,
            header: {
                title: '商品添加',
            },
        }
    },
    stores: [],
});

