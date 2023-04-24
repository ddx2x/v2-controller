import { FormColumnsType } from '@/dynamic-components';
import { privilegeStore, Role, roleStore } from '@/service/api';
import { TreeSelect } from 'antd';

export const name: FormColumnsType = {
  title: '角色岗位',
  dataIndex: 'name',
  valueType: 'autoComplete',
  editable: false,
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
      {
        validator: (rule, value, callback) => {
          if (!value) {
            callback();
            return;
          }
          roleStore.api
            .list(value, {}, 'name')
            .then((res: Role[]) => {
              res.length > 0 && res.find((item) => item.name === value)
                ? callback('角色岗位名已存在')
                : callback();
            })
            .catch((e) => callback('error' + e));
        },
      },
    ],
  },
};

export const type: FormColumnsType = {
  title: '岗位类型',
  dataIndex: 'type',
  valueType: 'select',
  editable: false,
  // hideInSearch: true,
  valueEnum: {
    0: '平台岗位',
    1: '门店岗位',
    2: '供应商岗位',
    3: '区域岗位',
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

export interface TreeSelect {
  title: string;
  value: string;
  children: TreeSelect[];
}

export const privileges: FormColumnsType = {
  title: '权限列表',
  dataIndex: 'privileges',
  valueType: 'treeSelect',
  editable: false,
  hideInSearch: true,
  fieldProps: {
    treeCheckable: true,
    showCheckedStrategy: TreeSelect.SHOW_CHILD,
    mode: 'tags',
    multiple: true,
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
      const rs = await privilegeStore.api.list(undefined, {
        sort: { name: 1 },
      });
      let tree: TreeSelect[] = [];
      rs.filter((item) => item.level === 1).forEach((item) => {
        tree.push({
          title: item._id,
          value: item._id,
          children: [],
        });
      });

      rs.filter((item) => item.level === 2)
        .sort((a, b) => {
          return a._id.localeCompare(b._id);
        })
        .forEach((item) => {
          tree.forEach((t) => {
            if (!item.full_id) return;
            if (t.title === item.full_id.split('.')[0]) {
              t.children.push({
                title: item._id,
                value: item._id,
                children: [],
              });
            }
          });
        });
      return tree;
    } catch (e) {
      return [];
    }
  },
};
