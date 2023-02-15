
import type { FormColumnsType } from '@/dynamic-components';

export const product_name: FormColumnsType =
{
    dataIndex: 'product_name',
    title: '商品名称',
    hideInSearch: true,
    valueType: 'text',
    editable: false,
};

export const spec_name: FormColumnsType = {
    dataIndex: 'spec_name',
    title: '规格名称',
    hideInSearch: true,
    editable: false,
    valueType: 'text',
};
export const price: FormColumnsType = {
    dataIndex: 'price',
    title: '销售价格',
    hideInSearch: true,
    valueType: 'money',
    editable: false,
};
export const promotion_price: FormColumnsType = {
    dataIndex: 'promotion_price',
    title: '促销价格',
    hideInSearch: true,
    valueType: 'money',
    editable: false,
};
export const stock: FormColumnsType = {
    dataIndex: 'stock',
    title: '商品库存',
    hideInSearch: true,
    valueType: 'digit',
    editable: false,
};
export const low_stock: FormColumnsType = {
    dataIndex: 'low_stock',
    title: '库存预警',
    valueType: 'digit',
    editable: false,
};