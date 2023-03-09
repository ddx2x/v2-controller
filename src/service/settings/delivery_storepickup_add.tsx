import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { notification } from 'antd';
// import { parse } from 'querystring';
import { StorePickup, storePickupStore } from '../api';
import {
  bmap,
  business_days,
  contact,
  owner_store_name,
  pick_up_address,
  pick_up_name,
} from './delivery_storepickup_columns';

// kind: form
const addForm: FormProps = {
  submitter: {
    resetButtonProps: false,
  },
  onMount: ({ location, form, setDataObject }) => {
    form?.resetFields();
    if (location === undefined) return;
    // const query: any = parse(location?.search.split('?')[1] || '');
    // setDataObject({ delivery_id: query.id });
  },
  layoutType: 'Form',
  shouldUpdate: false,
  grid: true,
  columns: [pick_up_name, pick_up_address, bmap, owner_store_name, contact, business_days],
  onSubmit: ({ formRef, values, dataObject, handleClose }) => {
    const target: Partial<StorePickup> = {
      pick_up_name: values.pick_up_name,
      pick_up_address: values.pick_up_address,
      owner_store_name: values.owner_store_name,
      contact: values.contact,
      business_days: values.business_days,
      coordinates: [values.map.point.lng, values.map.point.lat],
      state: false,
    };

    storePickupStore
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

pageManager.register('setting.delivery.storepickupadd', {
  page: {
    view: [{ kind: 'form', ...addForm }],
    container: {
      keepAlive: false,
    },
  },
  stores: [],
});
