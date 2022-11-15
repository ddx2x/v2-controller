import { FormTemplate, templateManager } from '@/dynamic-components';

const form: FormTemplate = {
  layoutType: 'Form',
  columns: [
    {
      title: '商品图片',
      dataIndex: 'images',
      valueType: 'card',
    },
  ],
};

templateManager.register('form-testing', { template: { form: form } });
