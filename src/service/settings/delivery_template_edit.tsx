import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { parse } from 'querystring';
import { DeliverySettingTemplate, deliverySettingTemplateStore } from '../api';
import {
  continuation,
  continuation_freight,
  first,
  freight,
  region,
} from './delivery_template_columns';

declare type Query = {
  id?: string;
};

// kind: form
const editForm: FormProps = {
  submitter: {
    resetButtonProps: false,
  },
  onMount: ({ location, form, setDataObject }) => {
    form?.resetFields();
    if (location === undefined) return;
    const query: Query = parse(location?.search.split('?')[1] || '');
    deliverySettingTemplateStore.api.get(query.id, { limit: { page: 0, size: 1 } }).then((rs) => {
      if (typeof rs.region === 'string') rs.region = rs.region.split('、');
      form?.setFieldsValue(rs);
      setDataObject(rs);
    });
  },
  layoutType: 'Form',
  shouldUpdate: false,
  grid: true,
  columns: [region, first, freight, continuation, continuation_freight],
  onSubmit: ({ formRef, values, dataObject, handleClose }) => {
    const src: DeliverySettingTemplate = dataObject;

    const target: Partial<DeliverySettingTemplate> = {
      region: values.region,
      first: Number(values.first),
      freight: Number(values.freight),
      continuation: Number(values.continuation),
      continuation_freight: Number(values.continuation_freight),
    };

    deliverySettingTemplateStore
      .update_one(src, target, [
        'region',
        'first',
        'freight',
        'continuation',
        'continuation_freight',
      ])
      .then(() => {
        notification.success({ message: '保存成功' });
        history.push(`/setting/delivery`);
        formRef.current?.resetFields();
      })
      .catch((e) => notification.error({ message: e }));

    handleClose();
    return true;
  },
};

pageManager.register('setting.delivery.tempedit', {
  page: {
    view: [{ kind: 'form', ...editForm }],
    container: {
      keepAlive: false,
    },
  },
  stores: [],
});
