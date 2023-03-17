import { FormColumnsType } from '@/dynamic-components';
import { cmsDoorApi, Customer, customerStore } from '@/service/api';

export const name: FormColumnsType = {
  title: '用户名称',
  dataIndex: 'name',
  valueType: 'autoComplete',
  tooltip: '可以选择选择来自客户',
  editable: false,
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
      {
        validator: (rule, value, callback) => {
          if (!value) { callback(); return }
          customerStore.api
            .list(value, {}, 'name')
            .then((res) => {
              res.length > 0 ? callback('用户已存在') : callback()
            })
            .catch((e) => callback('error' + e));
        },
      },
    ],
  },
  fieldProps: {
    onSearch: async (text: string) => {
      return await customerStore.api
        .list(text, {}, 'name')
        .then((res: Customer[]) => res.map((value: Customer) => ({ value: value.name })));
    },
  },
};

export const phone_number: FormColumnsType = {
  title: '手机号',
  dataIndex: 'phone_number',
  valueType: 'text',
  editable: false,
  hideInSearch: true,
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
      {
        type: 'string',
        pattern: /^1[3456789]\d{9}$/,
        message: '请输入正确的手机号码',
      },
      {
        validator: (rule, value, callback) => {
          if (!value || value.length != 11) { callback(); return }
          customerStore.api
            .list(value, {}, 'phone')
            .then((res) => res.length > 0 ? callback('手机号已被注册') : callback())
            .catch((e) => callback('error' + e));
        },
      },
    ],
  },
};

export const login_type: FormColumnsType = {
  title: '登陆方式',
  dataIndex: 'login_type',
  valueType: 'select',
  editable: false,
  hideInSearch: true,
  valueEnum: {
    1: { text: '手机', icon: 'processing' },
    2: { text: '帐号', icon: 'processing' },
    3: { text: '手机+帐号', icon: 'processing' },
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

export const org_name: FormColumnsType = {
  title: '企业主体或门店',
  dataIndex: 'org_name',
  valueType: 'treeSelect',
  editable: false,
  hideInSearch: true,
  fieldProps: {
    showSearch: true,
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
      const rs = await cmsDoorApi.list(undefined, {});
      const tree = [];

      let headquarters = '';
      // Create a map of first names to arrays of second names
      const map = new Map();
      for (const item of rs) {
        const { head_quarters, first_name, second_name } = item;
        headquarters = head_quarters || '总部';
        if (!map.has(first_name)) {
          map.set(first_name, []);
        }
        map.get(first_name).push(second_name);
      }

      let sub_tree = [];

      // Convert the map to an array of objects with nested children

      for (const [first_name, second_names] of map) {
        const children = second_names.map((second_name: any) => ({
          title: second_name,
          value: second_name,
          key: second_name,
        }));
        sub_tree.push({
          title: first_name,
          value: first_name,
          key: first_name,
          children,
        });
      }

      tree.push({
        title: headquarters,
        value: headquarters,
        key: headquarters,
        children: sub_tree,
      });

      return tree;
    } catch (e) {
      return [];
    }
  },
};
