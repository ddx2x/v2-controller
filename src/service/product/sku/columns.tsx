
import type { FormColumnsType } from '@/dynamic-components';


export const pic: FormColumnsType = {
    dataIndex: 'pic',
    title: '图片',
    valueType: 'imageUpload',
    tooltip: '尺寸建议750x750像素以上，大小2M以下，最多5张 (可拖拽图片调整显示顺序)',
    fieldProps: {
        maxNumber: 1,
        name: 'upload',
        prefix: '/media-t/file/',
        action: '/media-t/upload',
    },
    formItemProps: {
        // rules: [
        //     {
        //         required: true,
        //         message: '此项为必填项',
        //     },
        // ],
    },
};

export const product_name: FormColumnsType =
{
    dataIndex: 'product_name',
    title: '商品名称',
    hideInSearch: true,
    valueType: 'text',
};

export const spec_name: FormColumnsType = {
    dataIndex: 'spec_name',
    title: '规格名称',
    hideInSearch: true,
    
    valueType: 'text',
};
export const price: FormColumnsType = {
    dataIndex: 'price',
    title: '销售价格',
    hideInSearch: true,
    valueType: 'money',
    
};
export const promotion_price: FormColumnsType = {
    dataIndex: 'promotion_price',
    title: '促销价格',
    hideInSearch: true,
    valueType: 'money',
    
};
export const stock: FormColumnsType = {
    dataIndex: 'stock',
    title: '商品库存',
    hideInSearch: true,
    valueType: 'digit',
    
};
export const low_stock: FormColumnsType = {
    dataIndex: 'low_stock',
    title: '库存预警',
    valueType: 'digit',
    
};