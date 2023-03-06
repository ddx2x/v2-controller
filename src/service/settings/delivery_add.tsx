import { FormColumnsType, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { DeliverySetting, deliverySettingStore } from '../api';

const name: FormColumnsType = {
  title: '模板名称',
  dataIndex: 'name',
  valueType: 'text',
  fieldProps: {
    placeholder: '请输模板名称',
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

const type: FormColumnsType = {
  title: '模板类型',
  dataIndex: 'type',
  // tooltip: '空表示一级分类',
  valueType: 'radioButton',
  fieldProps: {
    // disabled: true,
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
    0: {
      text: '买家承担运费',
    },
    1: {
      text: '卖家包邮',
    },
  },
};

const pricing_method: FormColumnsType = {
  dataIndex: 'pricing_method',
  title: '计件方式',
  valueType: 'radioButton',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
  valueEnum: {
    '0': '按件数',
    '1': '按重量',
    '2': '按体积',
  },
};

// kind: form
const addForm: FormProps = {
  submitter: {
    resetButtonProps: false,
  },
  onMount: ({ location, form }) => {
    form?.resetFields();
    if (location === undefined) return;
  },
  layoutType: 'Form',
  shouldUpdate: false,
  grid: true,
  // layout: 'horizontal',
  // colProps: { flex: 'auto' },
  columns: [name, type, pricing_method],
  onSubmit: ({ formRef, values, dataObject, handleClose }) => {
    const target: Partial<DeliverySetting> = {
      name: values.name,
      type: Number(values.type),
      pricing_method: Number(values.pricing_method),
    };

    deliverySettingStore
      .create(target)
      .then(() => {
        // message.success('保存成功');
        formRef.current?.resetFields();
      })
      .catch((e) => {
        // message.error(e)
      });

    handleClose();
    return true;
  },
};

pageManager.register('setting.delivery.add', {
  page: {
    view: [{ kind: 'form', ...addForm }],
    container: {
      keepAlive: false,
    },
  },
  stores: [],
});
