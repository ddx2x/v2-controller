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

// kind: form
const addForm: FormProps = {
  submitter: {
    resetButtonProps: false,
  },
  onMount: ({ location, form, setDataObject }) => {
    form?.resetFields();
    if (location === undefined) return;
    const query: any = parse(location?.search.split('?')[1] || '');
    setDataObject({ delivery_id: query.id });
  },
  layoutType: 'Form',
  shouldUpdate: false,
  grid: true,
  columns: [region, first, freight, continuation, continuation_freight],
  onSubmit: ({ formRef, values, dataObject, handleClose }) => {
    const target: Partial<DeliverySettingTemplate> = {
      delivery_id: dataObject.delivery_id,
      region: values.region,
      first: Number(values.first),
      freight: Number(values.freight),
      continuation: Number(values.continuation),
      continuation_freight: Number(values.continuation_freight),
    };

    deliverySettingTemplateStore
      .create(target)
      .then(() => {
        notification.success({ message: '保存成功' });
        history.push(`/setting/delivery`);
        formRef.current?.resetFields();
      })
      .catch((e) => {
        notification.error({ message: e });
      });

    handleClose();
    return true;
  },
};

pageManager.register('setting.delivery.tempadd', {
  page: {
    view: [{ kind: 'form', ...addForm }],
    container: {
      keepAlive: false,
    },
  },
  stores: [],
});
