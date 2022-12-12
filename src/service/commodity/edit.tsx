import { pageManager, View } from '@/dynamic-view';
import { parse } from 'querystring';

// const videoModule: React.FC<ProFieldFCRenderProps> = (props) => {
//     const { fieldProps } = props
//     const [form] = useForm({
//         title: '新增视频',
//         layoutType: 'ModalForm',
//         initialValues: fieldProps.value,
//         onValuesChange: (_: any, values: any) => fieldProps.onChange && fieldProps.onChange(values),
//         columns: [
//             {
//                 title: '标题',
//                 valueType: 'videoModule',
//                 fieldProps: {
//                     showCount: true,
//                     maxLength: 20,
//                 },
//             },
//             {
//                 title: '主图',
//                 dataIndex: 'poster',
//                 valueType: 'switch',
//                 fieldProps: {
//                     name: 'upload',
//                     action: '/media/upload',
//                     maxNumber: 1,
//                 },
//             },
//             {
//                 title: '商品视频',
//                 dataIndex: 'images',
//                 valueType: 'videoModule',
//                 tooltip: '视频不能超过10M，视频时限20秒内，支持mp4视频格式',
//                 fieldProps: {
//                     name: 'upload',
//                     action: '/media/upload',
//                     maxNumber: 1,
//                 },
//             },
//         ],
//     });

//     return <>{form}</>;
// };

// valueTypeMapStore.registerValueType({ videoModule });

export const editView: View = {
    kind: 'stepForm',
    mount: (location, formRef) => {
        console.log('location?.search', location?.search, formRef);

        let data = location?.search.split("?")[1] || "";

        console.log("parse ", parse(data));
        location?.search &&
            formRef.current?.setFieldsValue({ name: location?.search })
    },

    unMount: (location, formRef) => {
        formRef.current?.resetFields()
    },
    
    steps: [
        { title: '基本信息' },
        { title: '交付设置' },
        { title: '扩展信息' },
        { title: '图文详情' },
    ],
    columns: [
        [
            {
                title: '商品类型',
                dataIndex: 'types',
                valueType: 'radio',
                initialValue: 'a',
                valueEnum: {
                    a: '实物商品（物流发货）',
                    b: '实物商品（跨境海淘）',
                    c: '虚拟商品 （通用）',
                    d: '虚拟商品 （付费券）',
                },
            },
            {
                title: '销售渠道',
                dataIndex: 'salesChannels',
                valueType: 'checkbox',
                initialValue: ['online'],
                valueEnum: {
                    online: '线上销售',
                    offline: '线下销售',
                },
                formItemProps: {
                    rules: [
                        {
                            required: true,
                            message: '此项为必填项',
                        },
                    ],
                },
            },
            {
                title: '销售模式',
                dataIndex: 'salesModel',
                valueType: 'radio',
                valueEnum: {
                    a: '现货销售',
                    b: '预售模式（商家设置商品预售数量，各门店需自行修改预售数量）',
                    c: '抽签模式',
                },
            },
            {
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
            },
            {
                title: '商品标语',
                dataIndex: 'idiom',
                valueType: 'text',
                width: '400px',
            },
            {
                title: '单位',
                dataIndex: 'unit',
                valueType: 'select',
                valueEnum: {
                    kg: '千克',
                    g: '克',
                },
                width: '200px',
            },
            {
                title: '商家统一价',
                dataIndex: 'merchantUniformPrice',
                valueType: 'money',
                width: '400px',
                formItemProps: {
                    rules: [
                        {
                            required: true,
                            message: '此项为必填项',
                        },
                    ],
                },
            },
            {
                title: '门店售价区间',
                dataIndex: 'storePriceRange',
                valueType: 'digitRange',
                width: '200px',
            },
            {
                title: '规格',
                dataIndex: 'specification',
                valueType: 'form',
                fieldProps: {
                    title: '规格配置',
                    triggerText: '操作',
                    columns: [
                        {
                            title: '名称',
                            dataIndex: 'text',
                            valueType: 'date',
                        },
                    ],
                },
            },
            {
                title: '市场价',
                dataIndex: 'marketPrice',
                valueType: 'money',
                width: '400px',
                formItemProps: {
                    rules: [
                        {
                            required: true,
                            message: '此项为必填项',
                        },
                    ],
                },
            },
            {
                title: '重量',
                dataIndex: 'weight',
                valueType: 'digit',
                width: '400px',
                fieldProps: {
                    addonAfter: 'kg',
                },
            },
            {
                title: '体积',
                dataIndex: 'volume',
                valueType: 'digit',
                width: '400px',
                fieldProps: {
                    addonAfter: 'm³',
                },
            },
            {
                title: '商品图片',
                dataIndex: 'images',
                valueType: 'imageUpload',
                tooltip: '尺寸建议750x750像素以上，大小2M以下，最多5张 (可拖拽图片调整显示顺序)',
                fieldProps: {
                    name: 'upload',
                    action: '/api/images/upload',
                },
            },
        ],
        [
            {
                title: '配送方式',
                dataIndex: 'deliveryMethod',
                initialValue: ['a', 'b'],
                valueType: 'checkbox',
                valueEnum: {
                    a: '商家配送',
                    b: '到店自提',
                },
            },
        ],
        [],
        [],
    ],
};



pageManager.register('commdity.list.add', {
    page: {
        view: [editView],
        container: {
            keepAlive: true,
            header: {
                title: '商品信息 新增',
            },
        }
    },
    stores: [],
});

pageManager.register('commdity.list.edit', {
    page: {
        view: [editView],
        container: {
            keepAlive: false,
            header: {
                title: '商品信息 编辑',
            },
        }
    },
    stores: [],
});

export let types: Object = {
    title: '商品类型',
    dataIndex: 'types',
    valueType: 'radio',
    initialValue: ['1'],
    valueEnum: {
        1: '实物商品（物流发货）',
        2: '实物商品（跨境海淘）',
        3: '虚拟商品（通用）',
        4: '虚拟商品（付费券）',
    },
};

export const editAggregateView: View = {
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
    steps: [
        { title: '基本信息' },
        { title: '交付设置' },
        { title: '图文详情' },
    ],
    columns: [
        [
            types,
            {
                title: '销售渠道',
                dataIndex: 'salesChannels',
                valueType: 'checkbox',
                initialValue: ['1', '2'],
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
            },
            {
                title: '销售模式',
                dataIndex: 'salesModel',
                valueType: 'radio',
                initialValue: [],
                valueEnum: {
                    1: '现货销售',
                    2: '预售模式（商家设置商品预售数量，各门店需自行修改预售数量）',
                    3: '抽签模式',
                },
            },
            {
                title: '商品名称',
                dataIndex: 'name',
                valueType: 'text',
                fieldProps: {
                    placeholder: '请输入商品的名称',
                },
                formItemProps: {
                    rules: [
                        {
                            required: true,
                            min: 2,
                            max: 64,
                            message: '此项为必填项,最小2个字符,最大64个字符',
                        },
                    ],
                },
                width: "40%",
            },
            {
                title: '商品标语',
                dataIndex: 'idiom',
                valueType: 'text',
                width: "40%",
            },
            {
                title: '单位',
                dataIndex: 'unit',
                valueType: 'select',
                valueEnum: {
                    kg: '千克',
                    g: '克',
                },
                width: "40%",
            },
        ],
        [
            {
                title: '配送方式',
                dataIndex: 'deliveryMethod',
                initialValue: [1],
                valueType: 'checkbox',
                valueEnum: {
                    1: '商家配送',
                    2: '到店自提',
                },
                width: "40%",
            },
        ],
        [],
    ],
};

pageManager.register('commdity.list.aggregate_edit', {
    page: {
        view: [editAggregateView],
        container: {
            keepAlive: true,
            header: {
                title: '商品编辑',
            },
        }
    },
    stores: [],
});
