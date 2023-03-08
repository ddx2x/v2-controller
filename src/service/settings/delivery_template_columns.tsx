import { FormColumnsType } from '@/dynamic-components';
import { Region, regionStore } from '../api/region.store';

interface TreeSelect {
  title: string;
  value: string;
  uid: string;
  children: TreeSelect[];
}

export const region: FormColumnsType = {
  title: '可配送区域',
  dataIndex: 'region',
  valueType: 'treeSelect',
  fieldProps: {
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
      const rs = await regionStore.api.list(undefined);
      let select: TreeSelect[] = [];
      // level 1
      rs.map((value: Region) => {
        if (value.level == 1) {
          if (!value.name) return;
          select.push({ title: value.name, value: value.name, uid: value.uid, children: [] });
        }
      });
      // level 2
      rs.map((value: Region) => {
        if (value.level !== 2) {
          return;
        }
        select.map((treeSelect) => {
          if (treeSelect.uid === value.uid.substring(0, 2)) {
            if (!value.name) return;
            treeSelect.children.push({
              title: treeSelect.title + value.name,
              value: treeSelect.title + value.name,
              uid: value.uid,
              children: [],
            });
          }
        });
      });
      // level 3
      rs.map((value: Region) => {
        if (value.level !== 3) {
          return;
        }
        select.map((treeSelect) => {
          if (treeSelect.uid === value.uid.substring(0, 2)) {
            if (!value.name) return;
            treeSelect.children.map((treeSelect) => {
              if (treeSelect.uid === value.uid.substring(0, 4)) {
                if (!value.name) return;
                treeSelect.children.push({
                  title: treeSelect.title + value.name,
                  value: treeSelect.title + value.name,
                  uid: value.uid,
                  children: [],
                });
              }
            });
          }
        });
      });

      return select;
    } catch (e) {
      return [];
    }
  },
};

export const first: FormColumnsType = {
  title: '首件（个）',
  dataIndex: 'first',
  valueType: 'digit',
  fieldProps: {},
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
};

export const freight: FormColumnsType = {
  title: '首费（个）',
  dataIndex: 'freight',
  valueType: 'money',
  fieldProps: {},
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
};

export const continuation: FormColumnsType = {
  title: '续件（个）',
  dataIndex: 'continuation',
  valueType: 'text',
  fieldProps: {},
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
};

export const continuation_freight: FormColumnsType = {
  title: '续费（元）',
  dataIndex: 'continuation_freight',
  valueType: 'digit',
  fieldProps: {},
  formItemProps: {
    rules: [
      {
        required: true,
        message: '此项为必填项',
      },
    ],
  },
};
