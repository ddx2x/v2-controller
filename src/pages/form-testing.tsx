import { FormColumnsType, FormTemplate, templateManager } from '@/dynamic-components';
import { FormInstance } from 'antd';

const columns: FormColumnsType = [
  {
    title: '商品图片',
    dataIndex: 'images',
    valueType: 'uploader',
    tooltip: '尺寸建议750x750像素以上，大小2M以下，最多5张 (可拖拽图片调整显示顺序)',
    fieldProps: {
      name: 'upload',
      action: '/images/upload',
      maxNumber: 2,
    },
  },
];

const form: FormTemplate = {
  columns: columns,
  onSubmit: (form: FormInstance<any> | undefined, values: any) => {
    console.log(values);
    return true;
  },
};

templateManager.register('form-testing', { form: form });
