import { FormColumnsType } from "@/dynamic-components";
import { cmsDoorApi, customerStore } from "@/service/api";

interface TreeSelect {
    title: string;
    value: string;
    children: TreeSelect[];
  }
  
  export const name: FormColumnsType = {
    title: '用户名称',
    dataIndex: 'name',
    valueType: 'select',
    tooltip: '必须选择来自客户',
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
        const rs = await customerStore.api.list(undefined, {});
        let select: TreeSelect[] = [];
        rs.map((r) => {
          if (!r.name) return;
          select.push({
            title: r.uid,
            value: r.name,
            children: [],
          });
        });
        return select;
      } catch (e) {
        return [];
      }
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