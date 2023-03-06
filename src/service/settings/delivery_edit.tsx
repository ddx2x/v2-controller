import { FormColumnsType, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { parse } from 'querystring';
import { deliverySettingStore } from '../api';

export const name: FormColumnsType = {
  title: '模板名称',
  dataIndex: 'name',
  valueType: 'text',
  fieldProps: {
    placeholder: '请输模板名称',
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

export const type: FormColumnsType = {
  title: '模板类型',
  dataIndex: 'type',
  // tooltip: '空表示一级分类',
  valueType: 'radioButton',
  fieldProps: {
    // disabled: true,
  },
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
  valueEnum: {
    0: {
      text: '买家承担运费',
    },
    1: {
      text: '卖家包邮',
    },
  },
};

export const pricing_method: FormColumnsType = {
  dataIndex: 'pricing_method',
  title: '计件方式',
  valueType: 'radioButton',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
  valueEnum: {
    '0': '按件数',
    '1': '按重量',
    '2': '按体积',
  },
};

declare type Query = {
  id?: string;
};

// kind: form
const editForm: FormProps = {
  submitter: {
    resetButtonProps: false,
  },
  onMount: ({ location, form }) => {
    form?.resetFields();
    if (location === undefined) return;
    const query: Query = parse(location?.search.split('?')[1] || '');
    deliverySettingStore.get(query.id).then((rs) => {
      form?.setFieldsValue(rs);
    });
  },
  layoutType: 'Form',
  shouldUpdate: false,
  grid: true,
  // layout: 'horizontal',
  // colProps: { flex: 'auto' },
  columns: [name, type, pricing_method],
  onSubmit: ({ formRef, values, dataObject, handleClose }) => {
    // const src: Category = dataObject;
    // const target: Partial<Category> = {
    //   nav_status: Number(values.nav_status),
    //   keywords: values.keywords,
    //   description: String(values.description) || '',
    // };

    // categoryStore
    //   .update_one(src, target, ['nav_status', 'show_status', 'sort', 'keywords', 'description'])
    //   .then(() => {
    //     message.success('保存成功');
    //     formRef.current?.resetFields();
    //   })
    //   .catch((e) => message.error(e));

    handleClose();
    return true;
  },
};

pageManager.register('setting.delivery.edit', {
  page: {
    view: [{ kind: 'form', ...editForm }],
    container: {
      keepAlive: false,
    },
  },
  stores: [],
});
