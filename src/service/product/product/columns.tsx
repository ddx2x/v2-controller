import { FormColumnsType } from '@/dynamic-components';
import { categoryApi } from '../category';

export const name: FormColumnsType = {
  dataIndex: 'name',
  title: '商品名称',
  hideInSearch: true,
  fieldProps: {
    placeholder: '请输入分类名称',
  },
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
      {
        message: '最小6个字符最大64',
        type: 'string',
        min: 1,
        max: 64
      }
    ],
  },

}

export const brand_name: FormColumnsType = {
  dataIndex: 'brand_name',
  title: '品牌名称',
  hideInSearch: true,
  fieldProps: {
    placeholder: '请输入品牌名称',

  },
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
}

export const product_category_main_name: FormColumnsType = {
  dataIndex: 'product_category_main_name',
  title: '产品大类',
  hideInSearch: true,
  fieldProps: {
    placeholder: '请输入产品分类',
  },
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
}

export const product_category_second_name_dependency: FormColumnsType = {
  valueType: 'dependency',
  name: ['product_category_main_name'],
  columns: ({ product_category_main_name }) => {
    return product_category_main_name ? [product_category_second_name] : []
  },
}

export const product_category_second_name: FormColumnsType = {
  dataIndex: 'product_category_second_name',
  title: '产品分类',
  hideInSearch: true,
  fieldProps: {
    placeholder: '请输入产品分类',
  },
  dependencies: ['product_category_main_name'],
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
  request: async (params: any, props: any) => {
    try {
      const rs = await categoryApi
        .list(undefined, { limit: { page: 0, size: 500 }, sort: { version: 1 }, filter: { level: 1, ...params } });
      let select: any = [];
      rs.map((value) => { select.push({ label: value.uid, value: value.uid }); });
      return select;
    } catch (e) {
      return [];
    }
  }
}
export const product_sn: FormColumnsType = {
  dataIndex: 'product_sn',
  title: '货号',
  fieldProps: {
    placeholder: '请输入货号',

  },
  hideInSearch: true,
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
}

export const delete_status: FormColumnsType = {
  dataIndex: 'delete_status',
  title: '删除状态',
  hideInSearch: true,
  editable: false,
  valueType: "radio",
  valueEnum: {
    0: "未删除",
    1: "已删除"
  },
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
}

export const new_status: FormColumnsType = {
  dataIndex: 'new_status',
  title: '新品状态',
  hideInSearch: true,
  editable: false,
  valueType: "radio",
  valueEnum: {
    0: "不是新品",
    1: "新品"
  },
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
}

export const recommand_status: FormColumnsType = {
  dataIndex: 'recommand_status',
  title: '推荐状态',
  hideInSearch: true,
  valueType: "radio",
  valueEnum: {
    0: "不推荐",
    1: "推荐"
  },
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
}

export const sort: FormColumnsType = {
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
}