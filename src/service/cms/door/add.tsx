import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { CmsDoor, cmsDoorStore } from '@/service/api/cmsDoor.store';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { cloneDeep, merge } from 'lodash';
import {
  address,
  admin_account,
  admin_name,
  bmap,
  business_days_dependency,
  contact,
  first_name,
  labels,
  logo,
  online_store_status,
  region_name,
  second_name,
  store_status,
} from './columns';

// kind: form
const form: FormProps = {
  onMount: ({ form }) => {
    form?.resetFields();
  },
  layoutType: 'Form',
  shouldUpdate: false,
  columns: [
    merge(cloneDeep(first_name), { fieldProps: { disabled: false } }),
    merge(cloneDeep(second_name), { fieldProps: { disabled: false } }),
    admin_name,
    contact,
    admin_account,
    region_name,
    address,
    bmap,
    logo,
    store_status,
    business_days_dependency,
    online_store_status,
    labels,
  ],
  onSubmit: ({ formRef, values, handleClose }) => {
    let item: Partial<CmsDoor> = {
      ...values,
    };
    item.logo = values.logo?.fileList[0].name || '';
    item.online_store_status = values.online_store_status as boolean;
    item.store_status = values.store_status as boolean;
    item.address = values.map.address;
    item.coordinates = [values.map.point.lng, values.map.point.lat];

    cmsDoorStore
      .create(item)
      .then(() => {
        notification.success({ message: '保存成功' });
        formRef.current?.resetFields();
        history.push(`/cms/door`);
      })
      .catch((e) => notification.error(e));

    handleClose();
    return true;
  },
};

pageManager.register('cms.door.add', {
  page: {
    view: [{ kind: 'form', ...form }],
    container: {
      keepAlive: false,
    },
  },
  stores: [],
});
