import { FormColumnsType, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { shopApi } from './store';

let model: FormColumnsType = {
    title: '模式',
    dataIndex: 'mode',
    valueType: 'radio',
    initialValue: 1,
    valueEnum: {
        1: '单网店模式',
        2: '多网店模式',
        3: '导流门店模式',
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

let recommend_door: FormColumnsType = {
    title: '推荐',
    dataIndex: 'recommend_door',
    valueType: 'radio',
    initialValue: 0,
    valueEnum: {
        1: '开启',
        0: '关闭',
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

let recommend_door_name: FormColumnsType = {
    title: '选择推荐店',
    dataIndex: 'recommend_door_name',
    valueType: 'select',
    valueEnum: {
        1: {
            text: '总店',
        },
        2: {
            text: '广州分店',
        },
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

let recommend_door_name_dependency: FormColumnsType = {
    valueType: 'dependency',
    name: ['recommend_door'],
    columns: ({recommend_door}) => {
        return recommend_door != '0' ? [recommend_door_name]: []
    },
}

// kind: form
const defaultFrom: FormProps = {
    onMount: (location, formRef) => {
        formRef.current?.resetFields();
        shopApi.get().then(rs => {
            rs.mode = String(rs.mode);
            rs.recommend_door = String(rs.recommend_door ? 1 : 0);
            formRef.current?.setFieldsValue(rs);
        })

    },
    unMount: (location, formRef) => {
        formRef.current?.resetFields();
    },
    layoutType: 'Form',
    shouldUpdate: false,
    columns: [
        model,
        recommend_door,
        recommend_door_name_dependency,
    ],
    onSubmit: (formRef, values, handleClose) => {
        console.log("values", values)
        handleClose();
        return true
    }
};

pageManager.register('settings.shop', {
    page: {
        view: [{ kind: 'form', ...defaultFrom }],
        container: {
            keepAlive: true,
            header: {
                // title: '店铺信息',
            },
        },
    },
    stores: [],
});
