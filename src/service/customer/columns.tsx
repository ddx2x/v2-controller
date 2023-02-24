import { FormColumnsType } from '@/dynamic-components';

export const name: FormColumnsType = {
    dataIndex: 'name',
    title: '客户名称',
    hideInSearch: true,
    fieldProps: {
        placeholder: '请输入分类名称',
    },
    formItemProps: {
        rules: [
            {
                required: true,
                message: '此项为必填项',
            },
            {
                message: '最小6个字符最大64',
                type: 'string',
                min: 1,
                max: 64
            }
        ],
    },

}
