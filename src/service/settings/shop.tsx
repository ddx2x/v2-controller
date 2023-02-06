import { FormColumnsType, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { notification } from 'antd';
import { Shop, shopApi } from './store';

let name: FormColumnsType = {
    title: '名称',
    dataIndex: 'name',
    valueType: 'text',
    formItemProps: {
        rules: [
            {
                required: true,
                message: '此项为必填项',
            },
        ],
    },
};

let mode: FormColumnsType = {
    title: '模式',
    dataIndex: 'mode',
    valueType: 'radio',
    tooltip: `1.启用单店模式，手机端只展示一个商家店铺。门店可作为商家的自提点或配送点 2.启用多门店模式，则买家可在手机端选择门店 3.导流门店模式下用户在商家店下单必须选择服务门店，积分商城、社区团购仍扣减商家店库存`,
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
    columns: ({ recommend_door }) => {
        return recommend_door !== '0' ? [recommend_door_name] : []
    },
}


let industry: FormColumnsType = {
    title: '行业',
    dataIndex: 'industry',
    valueType: 'text',
    formItemProps: {
        rules: [
            {
                required: true,
                message: '此项为必填项',
            },
        ],
    },
};


let logo: FormColumnsType = {
    title: '商户logo',
    dataIndex: 'logo',
    valueType: 'imageUpload',
    tooltip: '尺寸建议750x750像素以上，大小2M以下，最多5张 (可拖拽图片调整显示顺序)',
    fieldProps: {
        maxNumber: 1,
        name: 'upload',
        action: '/media-t/upload',
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


let introduction: FormColumnsType = {
    title: '商户简介',
    dataIndex: 'introduction',
    valueType: 'textarea',
    formItemProps: {
        rules: [
            {
                required: true,
                message: '此项为必填项',
            },
        ],
    },
};

let address: FormColumnsType = {
    title: '地址',
    dataIndex: 'address',
    valueType: 'textarea',
    formItemProps: {
        rules: [
            {

            },
        ],
    },
}


// kind: form
const defaultFrom: FormProps = {
    onMount: (location, formRef) => {
        formRef.current?.resetFields();
        shopApi.get().then(rs => {
            rs.mode = String(rs.mode);
            rs.recommend_door = String(rs.recommend_door ? 1 : 0);
            rs.logo = {
                fileList: [
                    { name: rs.logo, url: "/media-t/file/" + rs.logo }
                ]
            }
            formRef.current?.setFieldsValue(rs);
        })

    },
    unMount: (location, formRef) => {
        formRef.current?.resetFields();
    },
    layoutType: 'Form',
    shouldUpdate: false,
    columns: [
        name,
        mode,
        recommend_door,
        recommend_door_name_dependency,
        industry,
        logo,
        introduction,
        address,

    ],
    onSubmit: (formRef, values, handleClose) => {
        let shop: Partial<Shop> = {
            name: values.name,
            mode: values.mode === "1" ? 1 : 0,
            address: values.address,
            logo: values.logo?.fileList[0].name,
            industry: values.industry,
            introduction: values.introduction,
            recommend_door: values.recommend_door === "1",
        };

        if (values.recommend_door_name !== "" || values.recommend_door_name !== undefined) {
            shop.recommend_door_name = values.recommend_door_name
        }
        shopApi.update(shop).
            then(() => { notification.success({ message: "保存成功" }); })
            .catch((e) => notification.error(e))

        handleClose();

        return true
    }
};

pageManager.register('setting.shop', {
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
