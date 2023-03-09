import { FormColumnsType } from '@/dynamic-components';
import { cmsDoorStore } from '../api';

interface TreeSelect {
  title: string;
  value: string;
  uid: string;
  children: TreeSelect[];
}

export const pick_up_name: FormColumnsType = {
  title: '自提点名称',
  dataIndex: 'pick_up_name',
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

export const pick_up_address: FormColumnsType = {
  title: '自提点地址',
  dataIndex: 'pick_up_address',
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

export const bmap: FormColumnsType = {
  title: '地图定位',
  dataIndex: 'map',
  valueType: 'map',
  dependencies: ['pick_up_address'],
  fieldProps: (form) => {
    form.setFieldValue('map', form.getFieldValue('pick_up_address'));
  },
};

export const owner_store_name: FormColumnsType = {
  title: '所属门店',
  dataIndex: 'owner_store_name',
  valueType: 'select',
  fieldProps: {},
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
      const rs = await cmsDoorStore.api.list(undefined, {
        limit: { page: 0, size: 500 },
        sort: { version: 1 },
      });
      let select: any = [];
      rs.map((value) => {
        select.push({ label: value.second_name, value: value.second_name });
      });
      return select;
    } catch (e) {
      return [];
    }
  },
};

export const contact: FormColumnsType = {
  title: '联系方式',
  dataIndex: 'contact',
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


export const business_days: FormColumnsType = {
	dataIndex: 'business_days',
	title: '营业时间',
	valueType: 'formList',
	hideInSearch: true,
	columns: [
		{
			valueType: 'group',
			
			fieldProps: {
				style: {
					margin: '0rem 1rem 0 1rem',
				},
			},
			columns: [
				{
					dataIndex: 'days',
					valueType: 'checkbox',
					title: '营业日',
					valueEnum: {
						1: '周一',
						2: '周二',
						3: '周三',
						4: '周四',
						5: '周五',
						6: '周六',
						7: '周日'
					}
				},
				{
					dataIndex: 'hours',
					valueType: 'timeRange',
					title: '时间段',
					fieldProps: {
						// bordered: false,
					},
				}
			]
		}
	],
	fieldProps: {
		alwaysShowItemLabel: true,
		max: 2,
	},
	formItemProps: {
		rules: [
			{
				required: true,
				message: '此项为必填项',
			}
		],
	},
};

export const state: FormColumnsType = {
  title: '状态',
  dataIndex: 'state',
  valueType: 'switch',
  fieldProps: {},

  valueEnum: {
    true: true,
    false: false,
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
