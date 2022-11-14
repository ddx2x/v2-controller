import { FormTemplate, templateManager } from '@/dynamic-components';

const form: FormTemplate = {
  layoutType: 'Form',
  columns: [
    {
      title: '商品图片',
      dataIndex: 'images',
      valueType: 'videoModule',
    },
  ],
};

templateManager.register('form-testing', { form: form });
