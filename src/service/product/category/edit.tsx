import { FormColumnsType, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { message } from 'antd';
import { parse } from 'querystring';
import { history } from 'umi';
import { Category, categoryApi, categoryStore } from '../../api/productCategory.store';

const name: FormColumnsType = {
  title: '类型名称',
  dataIndex: 'uid',
  valueType: 'text',
  fieldProps: {
    placeholder: '请输入分类名称',
    disabled: true,
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

const parent_id: FormColumnsType = {
  title: '上级名称',
  dataIndex: 'parent_id',
  tooltip: '空表示一级分类',
  valueType: 'select',
  fieldProps: {
    disabled: true,
  },
};

const parent_id_dependency: FormColumnsType = {
  valueType: 'dependency',
  name: ['level'],
  columns: ({ level }) => {
    return level === 2 ? [parent_id] : [];
  },
};

const level: FormColumnsType = {
  title: '分类级别',
  dataIndex: 'level',
  valueType: 'digit',
  initialValue: 2,
  fieldProps: {
    min: 1,
    max: 2,
    disabled: true,
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

const nav_status: FormColumnsType = {
  title: '是否显示在导航栏',
  dataIndex: 'nav_status',
  valueType: 'radioButton',
  initialValue: '0',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
    style: {
      width: '100%',
    },
  },
  valueEnum: {
    0: '不显示',
    1: '显示',
  },
};

const show_status: FormColumnsType = {
  dataIndex: 'show_status',
  title: '显示状态',
  valueType: 'radio',
  initialValue: '0',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
  valueEnum: {
    0: '不显示',
    1: '显示',
  },
};

const sort: FormColumnsType = {
  dataIndex: 'sort',
  title: '排序',
  valueType: 'digit',
  initialValue: 1,
  fieldProps: {
    min: 1,
    max: 99,
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

const keywords: FormColumnsType = {
  dataIndex: 'keywords',
  title: '关键字',
  valueType: 'select',
  formItemProps: {
    style: {
      width: '100%',
    },
  },
  fieldProps: {
    mode: 'tags',
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
};

const description: FormColumnsType = {
  dataIndex: 'description',
  title: '描述',
  valueType: 'textarea',
  fieldProps: {},
};

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
    categoryApi.get(query.id).then((rs) => {
      rs.nav_status = String(rs.nav_status);
      setDataObject(rs);
      form?.setFieldsValue(rs);
    });
  },
  layoutType: 'Form',
  shouldUpdate: false,
  // grid: true,
  layout: 'horizontal',
  colProps: { flex: 'auto' },
  columns: [
    {
      dataIndex: 'u',
      title: '基本信息',
      valueType: 'group',

      columns: [name, level, parent_id_dependency, nav_status],
    },

    keywords,
    description,
  ],
  onSubmit: ({ formRef, values, dataObject, handleClose }) => {
    let target: Partial<Category> = {
      nav_status: Number(values.nav_status),
      level: Number(values.level),
      keywords: values.keywords || [],
      parent_id: values.parent_id || '',
      description: String(values.description || ''),
    };

    categoryStore
      .update_one(dataObject, target, [
        'level',
        'nav_status',
        'show_status',
        'keywords',
        'description',
        'parent_id',
      ])
      .then(() => {
        message.success('保存成功');
        history.push(`/product/category`);
        formRef.current?.resetFields();
      })
      .catch((e) => message.error(e));

    handleClose();
    return true;
  },
};

pageManager.register('product.category.edit', {
  page: {
    view: [{ kind: 'form', ...editForm }],
    container: {
      keepAlive: false,
    },
  },
  stores: [],
});
