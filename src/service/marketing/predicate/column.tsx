import { FormColumnsType } from '@/dynamic-components';

export const name_column: FormColumnsType = {
    title: '匹配规则名称',
    dataIndex: 'name',
    valueType: 'text',
    fieldProps: {
        placeholder: '请输入匹配规则名称',
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


export const key: FormColumnsType = {
    title: '匹配规则类型',
    dataIndex: 'key',
    valueType: 'select',
    formItemProps: {
        rules: [
            {
                required: true,
                message: '此项为必填项',
            },
        ],
    },
    valueEnum: {
        1: '按价格满减',
        2: '按数量满减',
    },
}


export const value: FormColumnsType = {
    title: '匹配规则对应值',
    dataIndex: 'value',
    valueType: 'digit',
    formItemProps: {
        rules: [
            {
                required: true,
                message: '此项为必填项',
            },
        ],
    },
}

