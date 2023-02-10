import type { FormColumnsType } from '@/dynamic-components';

export const name: FormColumnsType = {
  title: '品牌名称',
  dataIndex: 'uid',
  valueType: 'text',
  fieldProps: {
    placeholder: '输入品牌名称',
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

export const first_letter: FormColumnsType = {
  title: '首字母',
  dataIndex: 'first_letter',
  valueType: 'text',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
      {
        message: '必须是1位大写字母',
        min: 1,
        max: 1,
        type: "string",
      },
    ],
  },
};

export const factory_status: FormColumnsType = {
  title: '显示品牌制造商',
  dataIndex: 'factory_status',
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
    0: "否",
    1: "是",
  }

};

export const show_status: FormColumnsType = {
  dataIndex: 'show_status',
  title: '显示品牌',
  initialValue: '0',
  valueType: 'radio',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
  valueEnum: {
    0: "否",
    1: "是",
  }
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
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
};

export const big_pic: FormColumnsType = {
  dataIndex: 'big_pic',
  title: '专区大图',
  valueType: 'imageUpload',
  tooltip: '尺寸建议750x750像素以上，大小2M以下，最多5张 (可拖拽图片调整显示顺序)',
  fieldProps: {
    maxNumber: 1,
    name: 'upload',
    prefix: '/media-t/file/',
    action: '/media-t/upload',
  },
};


export const logo: FormColumnsType = {
  dataIndex: 'logo',
  title: '品牌logo',
  valueType: 'imageUpload',
  tooltip: '尺寸建议750x750像素以上，大小2M以下，最多5张 (可拖拽图片调整显示顺序)',
  fieldProps: {
    maxNumber: 1,
    name: 'upload',
    prefix: '/media-t/file/',
    action: '/media-t/upload',
  },
};


export const brand_story: FormColumnsType = {
  dataIndex: 'brand_story',
  title: '品牌故事',
  valueType: 'textarea',
};

