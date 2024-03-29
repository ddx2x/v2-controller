import { FormColumnsType, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { parse } from 'querystring';
import { Category, categoryApi } from '../../api/productCategory.store';

const name: FormColumnsType = {
  title: '类型名称',
  dataIndex: 'uid',
  valueType: 'text',
  fieldProps: {
    placeholder: '请输入分类名称',
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

const level: FormColumnsType = {
  title: '分类级别',
  dataIndex: 'level',
  valueType: 'radio',
  initialValue: '2',
  valueEnum: {
    1: '第一级',
    2: '第二级',
    3: '第三级',
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
  dependencies: ['level'],
  fieldProps: {
    placeholder: '请选择上级分类',
    showSearch: true,
    showArrow: true,
  },
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
  request: async (params) => {
    try {
      const rs = await categoryApi.list(undefined, {
        limit: { page: 0, size: 500 },
        sort: { version: 1 },
        filter: { level: params.level > 1 ? params.level - 1 : params.level },
      });
      let select: any = [];
      rs.map((value) => {
        select.push({ label: value.uid, value: value.uid });
      });
      return select;
    } catch (e) {
      return [];
    }
  },
};

const parent_id_dependency: FormColumnsType = {
  valueType: 'dependency',
  name: ['level'],
  columns: ({ level }) => {
    return level === '2' || level === '3' ? [parent_id] : [];
  },
};

const nav_status: FormColumnsType = {
  title: '是否显示在导航栏',
  dataIndex: 'nav_status',
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
  fieldProps: {
    mode: 'tags',
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

const description: FormColumnsType = {
  dataIndex: 'description',
  title: '描述',
  valueType: 'textarea',
  fieldProps: {
    mode: 'tags',
  },
};

declare type Query = {
  id?: string;
};

// kind: form
const addForm: FormProps = {
  onMount: ({ location, form, setDataObject }) => {
    form?.resetFields();
    if (location === undefined) return;
    const query: Query = parse(location?.search.split('?')[1] || '');
    form?.setFieldsValue({ category_id: query.id });
  },
  layoutType: 'Form',
  shouldUpdate: false,

  columns: [name, level, parent_id_dependency, nav_status, keywords, description],
  onSubmit: ({ formRef, values, handleClose }) => {
    let item: Partial<Category> = {
      uid: values.uid,
      level: Number(values.level),
      parent_id: values.parent_id || '',
      full_id: values.full_id || '',
      nav_status: Number(values.nav_status),
      keywords: values.keywords,
      description: values.description || '',
    };

    categoryApi
      .create(undefined, item)
      .then(() => {
        notification.success({ message: '保存成功' });
        formRef.current?.resetFields();
        // 跳转至数据编辑页
        history.push(`/product/category`);
      })
      .catch((e) => notification.error(e));
    handleClose();
    return true;
  },
};

pageManager.register('product.category.add', {
  page: {
    view: [{ kind: 'form', ...addForm }],
    container: {
      keepAlive: false,
      header: {
        title: '商品分类新增',
      },
    },
  },
  stores: [],
});
