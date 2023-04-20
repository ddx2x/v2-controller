import { FormColumnsType } from '@/dynamic-components';
import { marketingActionApi } from '@/service/api/marketingAction.store';
import { marketingPredicateApi } from '@/service/api/marketingPredicate.store';


export const name_column: FormColumnsType = {
    title: '优惠卷名称',
    dataIndex: 'name',
    valueType: 'text',
    fieldProps: {
        placeholder: '请输入优惠卷名称',
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


export const description: FormColumnsType = {
    title: '优惠卷描述',
    dataIndex: 'description',
    valueType: 'text',
    fieldProps: {
        placeholder: '请输入优惠卷描述',
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

export const merchant: FormColumnsType = {
    title: '商户选择',
    dataIndex: 'merchant',
    valueType: 'text',
    initialValue: '',
    fieldProps: {
        placeholder: 'merchant',
    },
};


export const expire: FormColumnsType = {
    title: '过期时间',
    dataIndex: 'expire_format',
    valueType: 'dateTime',
    formItemProps: {
        rules: [
            {
                required: true,
                message: '此项为必填项',
            },
        ],
    },
};

export const predicate: FormColumnsType = {
    dataIndex: 'predicate',
    title: '判定条件',
    valueType: 'objectSelect',
    formItemProps: {
        rules: [
            {
                required: true,
                message: '此项为必填项',
            },
        ],
    },
    fieldProps: {
        placeholder: '请选择判定条件',
    },
    request: async () => {
        try {
            const predicate = await marketingPredicateApi.list(undefined, {
                limit: { page: 0, size: 500 },
                sort: { version: 1 },
            });
            let select: any = [];
            predicate.map((value) => {
                select.push({ label: value.name, value: value.uid, option: value });
            });
            return select;
        } catch (e) {
            return [];
        }
    },
};

export const action: FormColumnsType = {
    dataIndex: 'action',
    title: '满减操作',
    valueType: 'objectSelect',
    fieldProps: {
        placeholder: '请选择满减操作',
    },
    formItemProps: {
        rules: [
            {
                required: true,
                message: '此项为必填项',
            },
        ],
    },
    request: async () => {
        try {
            const predicate = await marketingActionApi.list(undefined, {
                limit: { page: 0, size: 500 },
                sort: { version: 1 },
            });
            let select: any = [];
            predicate.map((value) => {
                select.push({ label: value.name, value: value.uid, option: value });
            });
            return select;
        } catch (e) {
            return [];
        }
    },
};

export const rule: FormColumnsType = {
    title: '规则',
    dataIndex: 'rule',
    valueType: 'group',
    columns: [
        predicate,
        action
    ],
}


export const perpetual: FormColumnsType = {
    title: '是否永久有效',
    dataIndex: 'perpetual',
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
        true: '是',
        false: '否',
    },
}


//max_claimable
export const max_claimable: FormColumnsType = {
    title: '客户最大领取数',
    dataIndex: 'max_claimable',
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



export const global: FormColumnsType = {
    title: '是否全局应用到商城',
    dataIndex: 'global',
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
        true: '是',
        false: '否',
    },
}

export const state: FormColumnsType = {
    title: '活动状态',
    dataIndex: 'state',
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
        1: '启用',
        2: '禁用',

    },
}
