import { FormColumnsType, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { parse } from 'querystring';
import {
  ProductAttribute,
  productAttributeApi,
  productAttributeStore,
} from '../../api/productAttribute.store';
import { input_select_list_dependency, input_type } from './columns';

const name: FormColumnsType = {
  title: '名称',
  dataIndex: 'name',
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

const category_id: FormColumnsType = {
  title: '商品类型',
  dataIndex: 'category_id',
  valueType: 'text',
  fieldProps: {
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

const select_type: FormColumnsType = {
  title: '属性选择类型',
  dataIndex: 'select_type',
  valueType: 'select',
  initialValue: '1',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
  valueEnum: {
    1: '单选',
    2: '多选',
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

const filter_type: FormColumnsType = {
  dataIndex: 'filter_type',
  title: '分类筛选样式',
  valueType: 'select',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
  valueEnum: {
    1: '普通',
    2: '颜色',
  },
};

const search_type: FormColumnsType = {
  dataIndex: 'search_type',
  title: '检索类型',
  valueType: 'select',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
  valueEnum: {
    0: '不需要进行检索',
    1: '关键字检索',
    2: '范围检索',
  },
};

const related_status: FormColumnsType = {
  dataIndex: 'related_status',
  title: '相同属性产品是否关联',
  valueType: 'select',

  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
  valueEnum: {
    0: '不关联',
    1: '关联',
  },
};

const hand_add_status: FormColumnsType = {
  dataIndex: 'hand_add_status',
  title: '是否支持手动新增',
  valueType: 'select',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
  valueEnum: {
    0: '不支持',
    1: '支持',
  },
};

const type: FormColumnsType = {
  dataIndex: 'type',
  title: '属性的类型',
  valueType: 'select',
  fieldProps: {
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
  valueEnum: {
    0: '规格',
    1: '参数',
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
  onMount: ({ location, form, setDataObject }) => {
    form?.resetFields();
    if (location === undefined) return;
    const query: Query = parse(location?.search.split('?')[1] || '');

    productAttributeApi
      .get(query.id)
      .then((rs) => {
        setDataObject(rs);
        rs.uid = query.id || '';
        // rs.select_type = String(rs.select_type);
        rs.input_type = String(rs.input_type);
        // rs.filter_type = String(rs.filter_type);
        // rs.search_type = String(rs.search_type);
        // rs.related_status = String(rs.related_status);
        // rs.hand_add_status = String(rs.hand_add_status);
        rs.type = String(rs.type);
        form?.setFieldsValue(rs);
      })
      .catch((e) => notification.error({ message: e }));
  },
  layoutType: 'Form',
  shouldUpdate: false,
  columns: [
    category_id,
    type,
    name,
    input_type,
    input_select_list_dependency,
    // sort,
    // filter_type,
    // search_type,
    // related_status,
    // hand_add_status,
  ],
  onSubmit: ({ formRef, values, dataObject, handleClose }) => {
    let item: Partial<ProductAttribute> = {
      // select_type: Number(values.select_type),
      input_type: Number(values.input_type),
      input_select_list: values.input_select_list,
    };

    productAttributeStore
      .update_one(dataObject, item, ['input_type', 'input_select_list'])
      .then((rs) => {
        notification.success({ message: '保存成功' });
        formRef.current?.resetFields();
        history.push(`/product/category`);
      })
      .catch((e) => notification.error(e));

    handleClose();
    return true;
  },
};

pageManager.register('product.category.attribute.edit', {
  page: {
    view: [{ kind: 'form', ...editForm }],
  },
  stores: [],
});
