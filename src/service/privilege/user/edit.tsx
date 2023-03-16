import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { parse } from 'querystring';
import { CmsDoor, cmsDoorStore } from '../../../service/api/cmsDoor.store';
import { login_type, name, org_name, phone_number } from './columns';

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
  columns: [name, login_type, phone_number, org_name],
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

pageManager.register('private.user.edit', {
  page: {
    view: [{ kind: 'form', ...editForm }],
    container: {
      keepAlive: false,
    },
  },
  stores: [],
});
