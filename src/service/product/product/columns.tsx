import { FormColumnsType } from '@/dynamic-components';
import { brandApi, DeliverySetting, deliverySettingApi } from '../../api';
import { Category, categoryApi } from '../category';

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
        max: 64,
      },
    ],
  },
};

export const brand_name: FormColumnsType = {
  dataIndex: 'brand_name',
  title: '品牌名称',
  hideInSearch: true,
  valueType: 'select',
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
  request: async () => {
    try {
      const rs = await brandApi.list(undefined, {
        limit: { page: 0, size: 500 },
        sort: { version: 1 },
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

export interface TreeSelect {
  title: string;
  value: string;
  children: TreeSelect[];
}

export const product_category_name: FormColumnsType = {
  dataIndex: 'product_category_name',
  title: '产品类型',
  hideInSearch: true,
  valueType: 'treeSelect',
  fieldProps: {
    placeholder: '请输入产品分类',
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
  request: async () => {
    try {
      const rs = await categoryApi.list(undefined, {
        limit: { page: 0, size: 500 },
        sort: { version: 1 },
      });
      let select: TreeSelect[] = [];
      // level 1
      rs.map((value: Category) => {
        if (value.level == 1) {
          select.push({ title: value.uid, value: value.uid, children: [] });
        }
      });
      // level 2
      rs.map((value: Category) => {
        if (value.level == 2) {
          if (!value.parent_id) {
            return;
          }
          select.map((treeSelect) => {
            if (treeSelect.title === value.parent_id) {
              treeSelect.children.push({ title: value.uid, value: value.uid, children: [] });
            }
          });
        }
      });
      return select;
    } catch (e) {
      return [];
    }
  },
};

// export const product_category_second_name_dependency: FormColumnsType = {
//   valueType: 'dependency',
//   name: ['product_category_main_name'],
//   columns: ({ product_category_main_name }) => {
//     return product_category_main_name ? [product_category_second_name] : []
//   },
// }

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
      const rs = await categoryApi.list(undefined, {
        limit: { page: 0, size: 500 },
        sort: { version: 1 },
        filter: { level: 2, full_id: params.product_category_main_name },
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
export const product_sn: FormColumnsType = {
  dataIndex: 'product_sn',
  title: '货号',
  fieldProps: {
    placeholder: '请输入货号',
  },
  hideInSearch: true,
  formItemProps: {},
};

export const delete_status: FormColumnsType = {
  dataIndex: 'delete_status',
  title: '删除状态',
  hideInSearch: true,
  editable: false,
  valueType: 'radioButton',
  initialValue: '0',
  valueEnum: {
    0: { text: '否', status: 'Success' },
    1: { text: '是', status: 'Error' },
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

export const new_status: FormColumnsType = {
  dataIndex: 'new_status',
  title: '新品状态',
  hideInSearch: true,
  editable: false,
  valueType: 'switch',
  valueEnum: {
    false: false,
    true: true,
  },
  formItemProps: {},
};

export const recommand_status: FormColumnsType = {
  dataIndex: 'recommand_status',
  title: '推荐状态',
  hideInSearch: true,
  valueType: 'switch',
  valueEnum: {
    false: false,
    true: true,
  },
  formItemProps: {},
};

export const sort: FormColumnsType = {
  dataIndex: 'sort',
  title: '排序',
  valueType: 'digit',
  initialValue: 1,
  fieldProps: {
    min: 1,
    max: 99,
  },
  formItemProps: {},
};

export const sub_title: FormColumnsType = {
  dataIndex: 'sub_title',
  title: '子标题',
  valueType: 'text',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
      {
        type: 'string',
        min: 1,
        max: 64,
      },
    ],
  },
};

export const weight: FormColumnsType = {
  dataIndex: 'unit',
  title: '商品重量',
  valueType: 'digit',
  tooltip: '默认为克',
  formItemProps: {},
};

export const preview_status: FormColumnsType = {
  dataIndex: 'preview_status',
  title: '是否为预告商品',
  hideInSearch: true,
  editable: false,
  valueType: 'radio',
  initialValue: '0',
  valueEnum: {
    0: '不是',
    1: '是',
  },
};

export const service_ids: FormColumnsType = {
  dataIndex: 'service_ids',
  title: '产品服务',
  tooltip: '多选',
  hideInSearch: true,
  editable: false,
  valueType: 'select',
  fieldProps: {
    mode: 'multiple',
  },
  valueEnum: {
    1: '无忧退货',
    2: '快速退款',
    3: '免费包邮',
  },
};

export const price: FormColumnsType = {
  dataIndex: 'price',
  title: '价格(起)',
  hideInSearch: true,
  valueType: 'money',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
      {
        type: 'number',
      },
    ],
  },
};

export const keywords: FormColumnsType = {
  dataIndex: 'keywords',
  title: '关键字',
  hideInSearch: true,
  tooltip: '自定义输入一个或者多个',
  valueType: 'select',
  fieldProps: {
    mode: 'tags',
  },
};

export const note: FormColumnsType = {
  dataIndex: 'note',
  title: '备注',
  valueType: 'textarea',
  formItemProps: {},
};

export const album_pics: FormColumnsType = {
  dataIndex: 'album_pics',
  title: '画册图片',
  valueType: 'imageUpload',
  tooltip: '尺寸建议750x750像素以上，大小2M以下，最多10张',
  fieldProps: {
    maxNumber: 10,
    name: 'upload',
    prefix: '/media-t/file/',
    action: '/media-t/upload',
  },
};

export const promotion_start_time: FormColumnsType = {
  dataIndex: 'promotion_start_time',
  title: '促销开始时间',
  valueType: 'dateTime',
  formItemProps: {},
};
export const promotion_end_time: FormColumnsType = {
  dataIndex: 'promotion_end_time',
  title: '促销结束时间',
  valueType: 'dateTime',
  formItemProps: {},
};
export const promotion_per_limit: FormColumnsType = {
  dataIndex: 'promotion_per_limit',
  title: '活动限购数量',
  valueType: 'digit',
  formItemProps: {},
};

export const promotion_type: FormColumnsType = {
  dataIndex: 'promotion_type',
  title: '促销类型',
  valueType: 'select',
  tooltip: '多选',
  fieldProps: {
    mode: 'tags',
  },
  valueEnum: {
    1: '使用促销价',
    2: '使用会员价',
    3: '使用满减价格',
    4: '限时购',
  },
};

export const low_stock: FormColumnsType = {
  dataIndex: 'low_stock',
  title: '库存预警值',
  valueType: 'digit',
  tooltip: '默认0为不限制',
  initialValue: 0,
};

export const publish_status: FormColumnsType = {
  dataIndex: 'publish_status',
  title: '上架状态',
  valueType: 'switch',
  fieldProps: {},
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
  valueEnum: {
    0: '下架',
    1: '上架',
  },
};

export const details: FormColumnsType = {
  dataIndex: 'details',
  title: '商品详情',
  valueType: 'quill',
};

export const default_test: FormColumnsType = {
  valueType: 'divider',
};

export const unit: FormColumnsType = {
  dataIndex: 'unit',
  title: '单位',
  valueType: 'text',
};

export const feight_template_id: FormColumnsType = {
  dataIndex: 'feight_template_id',
  title: '运费模板',
  valueType: 'select',
  request: async (params: any, props: any) => {
    try {
      const rs = await deliverySettingApi.list(undefined, {
        limit: { page: 0, size: 500 },
        sort: { version: 1 },
        filter: {},
      });
      let select: any = [];
      rs.map((value: DeliverySetting) => {
        select.push({ label: value.name, value: value.uid });
      });
      return select;
    } catch (e) {
      return [];
    }
  },
};
