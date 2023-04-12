import { FormColumnsType, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { notification } from 'antd';
import { OrderSetting, orderSettingApi, orderSettingStore } from '../api/settings.store';

const automatically_close_unpaid_orders_time: FormColumnsType = {
  title: '未支付订单后自动关闭（分钟）',
  dataIndex: 'automatically_close_unpaid_orders_time',
  tooltip: '最大90天',
  valueType: 'digit',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
      {
        type: 'number',
        min: 1,
        max: 129600,
      },
    ],
  },
};

const automatic_receipt_of_shipped_orders_time: FormColumnsType = {
  title: '已发货订单自动确认收货(分钟)',
  dataIndex: 'automatic_receipt_of_shipped_orders_time',
  valueType: 'digit',
  tooltip: '最大90天',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
      {
        type: 'number',
        min: 1,
        max: 129600,
      },
    ],
  },
};

const types_of_aftermarket_support_after_shipment: FormColumnsType = {
  title: '发货后支持的售后类型',
  dataIndex: 'types_of_aftermarket_support_after_shipment',
  valueType: 'checkbox',
  valueEnum: {
    1: '仅退款',
    2: '退货退款无需物流商品仅支持退款',
    3: '退换货目前仅支持同款同价的商品换货(不支持补差价)',
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

const after_sale_coupon_setting: FormColumnsType = {
  title: '售后退券设置',
  dataIndex: 'after_sale_coupon_setting',
  valueType: 'radio',
  valueEnum: {
    1: '支付前整单取消，退优惠券',
    2: '发货前整单售后，退优惠券',
    3: '过售后期前整单售后，退优惠券',
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

const predelivery_and_aftersales_application_settings: FormColumnsType = {
  title: '发货前售后申请审核',
  dataIndex: 'predelivery_and_aftersales_application_settings',
  valueType: 'switch',
  initialValue: false,
  valueEnum: {
    false: false,
    true: true,
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
const after_sale_prompts: FormColumnsType = {
  title: '售后提示语',
  dataIndex: 'after_sale_prompts',
  valueType: 'textarea',
  formItemProps: {
    rules: [
      // {
      // 	required: true,
      // 	message: '此项为必填项',
      // },
    ],
  },
};

const buyer_initiates_refund_request_day: FormColumnsType = {
  title: '买家发起售后,多少天后商家未处理，系统将自动同意退款',
  dataIndex: 'buyer_initiates_refund_request_day',
  valueType: 'digit',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
      {
        type: 'number',
        min: 1,
        max: 90,
      },
    ],
  },
};

const auto_confirm_buyer_has_returned_day: FormColumnsType = {
  title: '商家未处理，多少天后系统将自动同意',
  dataIndex: 'auto_confirm_buyer_has_returned_day',
  valueType: 'digit',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
      {
        type: 'number',
        min: 1,
        max: 90,
      },
    ],
  },
};

const buyer_return_method_setting: FormColumnsType = {
  title: '买家退货方式',
  dataIndex: 'buyer_return_method_setting',
  valueType: 'checkbox',
  valueEnum: {
    1: '买家物流寄回',
    2: '门店退货',
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

// kind: form
const defaultFrom: FormProps = {
  onMount: ({ form, setDataObject }) => {
    form?.resetFields();
    orderSettingApi.get().then((rs) => {
      setDataObject(rs);
      form?.setFieldsValue(rs);
    });
  },
  layoutType: 'Form',
  shouldUpdate: false,
  columns: [
    automatically_close_unpaid_orders_time,
    automatic_receipt_of_shipped_orders_time,
    types_of_aftermarket_support_after_shipment,
    after_sale_coupon_setting,
    predelivery_and_aftersales_application_settings,
    after_sale_prompts,
    buyer_initiates_refund_request_day,
    auto_confirm_buyer_has_returned_day,
    buyer_return_method_setting,
  ],
  onSubmit: ({ formRef, values, dataObject, handleClose }) => {
    const target: Partial<OrderSetting> = values;

    target.types_of_aftermarket_support_after_shipment =
      values.types_of_aftermarket_support_after_shipment?.map((item: any) => Number(item));
    target.buyer_return_method_setting = values.buyer_return_method_setting?.map((item: any) =>
      Number(item),
    );

    target.after_sale_coupon_setting = Number(values.after_sale_coupon_setting);

    orderSettingStore
      .update_one(dataObject, target, [
        'automatically_close_unpaid_orders_time',
        'automatic_receipt_of_shipped_orders_time',
        'types_of_aftermarket_support_after_shipment',
        'after_sale_coupon_setting',
        'predelivery_and_aftersales_application_settings',
        'after_sale_prompts',
        'buyer_initiates_refund_request_day',
        'auto_confirm_buyer_has_returned_day',
        'buyer_return_method_setting',
      ])
      .then(() => {
        notification.success({ message: '保存成功' });
      })
      .catch((e) => notification.error(e));

    handleClose();

    return true;
  },
};

pageManager.register('setting.order', {
  page: {
    view: [{ kind: 'form', ...defaultFrom }],
    container: {
      keepAlive: false,
      header: {},
    },
  },
  stores: [],
});
