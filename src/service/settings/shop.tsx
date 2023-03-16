import { FormColumnsType, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { Modal, notification } from 'antd';
import { cloneDeep, merge } from 'lodash';
import { cmsDoorStore } from '../api/cmsDoor.store';
import { Shop, shopStore } from '../api/settings.store';

const name: FormColumnsType = {
  title: '名称',
  dataIndex: 'name',
  tooltip: '店铺名称改动将会影响整个系统的显示及权限结构',
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

const mode_dependency: FormColumnsType = {
  valueType: 'dependency',
  name: ['mode'],
  columns: ({ mode }) => {
    return mode === '1'
      ? [
          merge(cloneDeep(mode_columns), {
            valueEnum: {
              2: '多店模式',
            },
          }),
        ]
      : [
          merge(cloneDeep(mode_columns), {
            valueEnum: {
              1: '单店模式',
            },
            fieldProps: {
              disabled: true,
            },
          }),
        ];
  },
};

const mode_columns: FormColumnsType = {
  title: '模式',
  dataIndex: 'mode',
  valueType: 'radio',
  tooltip: `1.启用单店模式，手机端只展示一个商家店铺。门店可作为商家的自提点或配送点 2.启用多门店模式，则买家可在手机端选择门店(切换后将不可修改)`,
  initialValue: 1,
  valueEnum: {
    1: '单店模式',
    2: '多店模式',
  },
  fieldProps: (form) => {
    return {
      onChange: (e: any) => {
        if (e.target.value !== '1') {
          Modal.confirm({
            title: '门店模式',
            content: '多门店模式一旦确认将不能变更',
            onOk: () => {},
            onCancel: () => {
              form.setFieldValue('mode', '1');
            },
          });
        }
      },
    };
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

const recommend_door_dependency: FormColumnsType = {
  valueType: 'dependency',
  name: ['mode'],
  columns: ({ mode }) => {
    return mode === '2' ? [recommend_door] : [];
  },
};

const recommend_door: FormColumnsType = {
  title: '门店推荐',
  dataIndex: 'recommend_door',
  valueType: 'radio',
  initialValue: 0,
  valueEnum: {
    1: '开启',
    0: '关闭',
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

interface TreeSelect {
  title: string;
  value: string;
}

let recommend_door_name_dependency: FormColumnsType = {
  valueType: 'dependency',
  name: ['mode', 'recommend_door'],
  columns: ({ recommend_door, mode }) => {
    return recommend_door !== '0' && mode === '2' ? [recommend_door_name] : [];
  },
};

let recommend_door_name: FormColumnsType = {
  title: '选择推荐店',
  dataIndex: 'recommend_door_name',
  valueType: 'select',
  fieldProps: {
    // showSearch: true,
    // search: true,
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
      let select: TreeSelect[] = [];
      let rs = await cmsDoorStore.api.list(undefined, { limit: { page: 0, size: 500 } });
      rs.forEach((r) => {
        if (!r.second_name) return;
        select.push({ title: r.second_name, value: r.second_name });
      });
      return select;
    } catch (e) {
      return [];
    }
  },
};

const industry: FormColumnsType = {
  title: '行业',
  dataIndex: 'industry',
  valueType: 'text',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
};

const logo: FormColumnsType = {
  title: '商户logo',
  dataIndex: 'logo',
  valueType: 'imageUpload',
  tooltip: '尺寸建议750x750像素以上，大小2M以下，最多5张 (可拖拽图片调整显示顺序)',
  fieldProps: {
    maxNumber: 1,
    name: 'upload',
    action: '/media-t/upload',
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

const introduction: FormColumnsType = {
  title: '商户简介',
  dataIndex: 'introduction',
  valueType: 'textarea',
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
};

const address: FormColumnsType = {
  title: '地址',
  dataIndex: 'address',
  valueType: 'textarea',
  formItemProps: {
    rules: [{}],
  },
};

// kind: form
const defaultFrom: FormProps = {
  onMount: ({ form, setDataObject }) => {
    form?.resetFields();
    shopStore.get().then((rs) => {
      setDataObject(rs);
      rs.mode = String(rs.mode);
      rs.recommend_door = String(rs.recommend_door ? 1 : 0);
      rs.logo = {
        fileList: [{ name: rs.logo, url: '/media-t/file/' + rs.logo }],
      };
      form?.setFieldsValue(rs);
    });
  },
  layoutType: 'Form',
  shouldUpdate: false,
  submitter: {
    resetButtonProps: false,
  },
  columns: [
    name,
    // mode_columns,
    mode_dependency,
    recommend_door_dependency,
    recommend_door_name_dependency,
    industry,
    logo,
    introduction,
    address,
  ],
  onSubmit: ({ formRef, values, dataObject, handleClose }) => {
    const target: Partial<Shop> = {
      name: values.name,
      mode: Number(values.mode),
      address: values.address,
      logo: values.logo?.fileList[0].name,
      industry: values.industry,
      introduction: values.introduction,
      recommend_door: values.recommend_door === '1',
    };

    if (values.recommend_door_name !== '' || values.recommend_door_name !== undefined) {
      target.recommend_door_name = values.recommend_door_name;
    }

    shopStore
      .update_one(dataObject, target, [
        'name',
        'address',
        'mode',
        'logo',
        'industry',
        'introduction',
        'recommend_door',
        'recommend_door_name',
      ])
      .then(() => {
        notification.success({ message: '保存成功' });
      })
      .catch((e) => notification.error(e));

    handleClose();

    return true;
  },
};

pageManager.register('setting.shop', {
  page: {
    view: [{ kind: 'form', ...defaultFrom }],
    container: {
      keepAlive: false,
      header: {},
    },
  },
  stores: [],
});
