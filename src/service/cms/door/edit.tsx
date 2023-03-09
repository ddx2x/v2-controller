import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { CmsDoor, cmsDoorStore } from '@/service/api/cmsDoor.store';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { cloneDeep, merge } from 'lodash';
import { parse } from 'querystring';
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
const editForm: FormProps = {
  submitter: {
    resetButtonProps: false,
  },
  onMount: ({ location, form, setDataObject }) => {
    form?.resetFields();
    if (location === undefined) return;
    const query: any = parse(location?.search.split('?')[1] || '');
    cmsDoorStore.api
      .get(query.id)
      .then((rs: CmsDoor) => {
        setDataObject(rs);
        form?.setFieldsValue(rs);
      })
      .catch((e) => notification.error({ message: e }));
  },
  layoutType: 'Form',
  shouldUpdate: false,
  columns: [
    merge(cloneDeep(first_name), { fieldProps: { disabled: true } }),
    merge(cloneDeep(second_name), { fieldProps: { disabled: true } }),
    admin_name,
    contact,
    admin_account,
    logo,
    region_name,
    address,
    bmap,

    store_status,
    business_days_dependency,
    online_store_status,

    labels,
  ],
  onSubmit: ({ values, dataObject, handleClose }) => {
    let target: Partial<CmsDoor> = {
      ...values,
    };

    target.logo = (values.logo?.fileList && values.logo?.fileList[0].name) || '';
    target.address = values.map.address;
    target.coordinates = [values.map.point.lng, values.map.point.lat];

    cmsDoorStore
      .update_one(dataObject, target, [
        'store_status',
        'online_store_status',
        'region_name',
        'address',
        'business_days',
        'logo',
        'admin_name',
        'admin_account',
        'contact',
        'coordinates',
      ])
      .then(() => {
        notification.success({ message: '保存成功' });
        history.push(`/cms/door`);
      })
      .catch((e) => notification.error(e));

    handleClose();
    return true;
  },
};

pageManager.register('cms.door.edit', {
  page: {
    view: [{ kind: 'form', ...editForm }],
    container: {
      keepAlive: false,
    },
  },
  stores: [],
});
