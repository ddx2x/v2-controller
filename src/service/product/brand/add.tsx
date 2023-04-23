import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { cloneDeep } from 'lodash';
import { Brand, brandStore } from '../../api/productBrand.store';
import {
  big_pic,
  brand_story,
  factory_status,
  first_letter,
  logo,
  name,
  show_status,
  sort,
} from './columns';

// kind: form
const form: FormProps = {
  onMount: ({ form }) => {
    form?.resetFields();
  },
  layoutType: 'Form',
  shouldUpdate: false,
  grid: true,
  // layout: 'horizontal',
  columns: [
    {
      valueType: 'group',
      title: '基本信息',
      fieldProps: {
        style: {
          width: '100%',
        },
      },
      columns: [cloneDeep(name), first_letter, factory_status, show_status, logo, sort],
    },
    {
      valueType: 'group',
      title: '品牌信息',

      fieldProps: {
        style: {},
      },
      columns: [big_pic, brand_story],
    },
  ],
  onSubmit: ({ formRef, values, handleClose }) => {
    let item: Partial<Brand> = {
      uid: values.uid,
      first_letter: values.first_letter,
      sort: Number(values.sort),
      factory_status: Number(values.factory_status),
      show_status: Number(values.show_status),
      logo: values.logo?.fileList[0].name || '',
      big_pic: values.big_pic,
      brand_story: values.brand_story,
    };

    brandStore.api
      .create(undefined, item)
      .then(() => {
        notification.success({ message: '保存成功' });
        formRef.current?.resetFields();
        history.push(`/product/brand`);
      })
      .catch((e) => notification.error(e));

    handleClose();
    return true;
  },
};

pageManager.register('product.brand.add', {
  page: {
    view: [{ kind: 'form', ...form }],
    container: {
      keepAlive: false,
    },
  },
  stores: [],
});
