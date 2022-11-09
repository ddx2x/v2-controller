import { FormColumnsType, FormTemplate, templateManager } from '@/dynamic-components';
import { FormInstance } from 'antd';
import { videoModule } from './dynamic-view';

const columns: FormColumnsType = [
  {
    title: '商品图片',
    dataIndex: 'images',
    valueType: 'videoModule',
  },
];

const form: FormTemplate = {
  columns: columns,
  onSubmit: (form: FormInstance<any> | undefined, values: any) => {
    console.log(values);
    return true;
  },
  proProviderValueTypeMap: {
    videoModule,
  },
};

templateManager.register('form-testing', { form: form });
