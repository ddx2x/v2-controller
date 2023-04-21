import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { Product, productApi, productStore } from '@/service/api/productProduct.store';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { merge } from 'lodash';
import { parse } from 'querystring';
import {
  album_pics,
  brand_name,
  details,
  keywords,
  name,
  new_status,
  price,
  product_category_name,
  product_sn,
  promotion_end_time,
  promotion_per_limit,
  promotion_start_time,
  promotion_type,
  recommand_status,
  service_ids,
  sort,
  sub_title,
} from './columns';

// kind: form
const editForm: FormProps = {
  submitter: {
    resetButtonProps: false,
    searchConfig: {
      submitText: '保存',
    },
  },
  onMount: ({ location, form, setDataObject }) => {
    if (location === undefined) return;
    const query: any = parse(location?.search.split('?')[1] || '');
    productApi
      .get(query.id)
      .then((rs: Product) => {
        setDataObject(rs);
        form.setFieldsValue(rs);
      })
      .catch((e) => notification.error({ message: e }));
  },
  layoutType: 'Form',
  shouldUpdate: false,
  layout: 'horizontal',
  colProps: {},
  columns: [
    {
      valueType: 'group',
      title: '基本信息',
      fieldProps: {
        style: {},
      },
      columns: [
        merge(product_category_name, { fieldProps: { disabled: true } }),

        merge(sub_title, { fieldProps: { disabled: true } }),
        merge(name, { fieldProps: { disabled: true } }),
        ,
        merge(brand_name, { fieldProps: { disabled: true } }),
        price,
      ],
    },

    {
      valueType: 'group',
      title: '其他信息',
      fieldProps: {
        style: {},
      },
      columns: [
        merge(product_sn, { fieldProps: { disabled: false } }),
        new_status,
        recommand_status,
        service_ids,
        keywords,
        sort,
      ],
    },

    {
      valueType: 'group',
      title: '促销信息',
      fieldProps: {
        style: {},
      },
      columns: [promotion_type, promotion_start_time, promotion_end_time, promotion_per_limit],
    },

    {
      valueType: 'group',
      title: '图片信息',
      fieldProps: {
        style: {},
      },
      columns: [album_pics],
    },

    {
      valueType: 'group',
      title: '更多信息',
      fieldProps: {
        style: {},
      },
      columns: [details],
    },
  ],
  onSubmit: ({ values, dataObject, handleClose }) => {
    let target: Partial<Product> = {
      // first_letter: values.first_letter,
      // factory_status: Number(values.factory_status),
      // show_status: Number(values.show_status),
      album_pics: values.album_pics?.fileList?.map((file: { name: any }) => file.name) || [],
      // big_pic: values.big_pic_copy?.fileList[0].name || "",
      // brand_story: values.brand_story,

      low_stock: values.low_stock,
      promotion_type: values.promotion_type?.map((item: any) => String(item)) || [],
      promotion_per_limit: values.promotion_per_limit,
      promotion_start_time: values.promotion_start_time,
      promotion_end_time: values.promotion_end_time,
      price: Number(values.price),

      // publish_status: values.publish_status,
      new_status: values.new_status ? 1 : 0,
      recommand_status: values.recommand_status ? 1 : 0,

      feight_template_id: values.feight_template_id,

      details: values.details,
      keywords: values.keywords,
      unit: values.unit,
      sort: Number(values.sort),
    };

    productStore
      .update_one(dataObject, target, [
        'album_pics',
        'details',
        'promotion_type',
        'promotion_per_limit',
        'promotion_start_time',
        'promotion_end_time',
        'low_stock',
        'keywords',
        'unit',
        'price',
        'new_status',
        'recommand_status',
        'feight_template_id',
      ])
      .then(() => {
        notification.success({ message: '保存成功' });
        history.push(`/product/product`);
      })
      .catch((e) => notification.error(e));

    handleClose();
    return true;
  },
};

pageManager.register('product.product.edit', {
  page: {
    view: [{ kind: 'form', ...editForm }],
    container: {
      keepAlive: false,
    },
  },
  stores: [],
});
