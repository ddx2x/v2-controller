import type { FormColumnsType } from '@/dynamic-components';
import { Region, regionStore } from '@/service/api/region.store';


export const first_name: FormColumnsType = {
	dataIndex: 'first_name',
	title: '门店',
	hideInSearch: true,
	editable: false,
	formItemProps: {
		rules: [
			{
				required: true,
				message: '此项为必填项',
			},
		],
	},
};
export const second_name: FormColumnsType = {
	dataIndex: 'second_name',
	title: '名称',
	hideInSearch: true,
	editable: false,
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
	title: string,
	value: string,
	uid: string,
	children: TreeSelect[],
}

export const region_name: FormColumnsType = {
	dataIndex: 'region_name',
	title: '行政区域',
	hideInSearch: true,
	editable: false,
	valueType: 'treeSelect',
	fieldProps: (form) => {
		const rs = {
			placeholder: '选择地区',
			showSearch: true,
			showArrow: true,
		}
		if (!form.getFieldValue('region_name')) return rs;
		form.resetFields(["address"]);
		form.setFieldValue('address', form.getFieldValue('region_name') + (form.getFieldValue('address') || ""))
		return rs
	},
	formItemProps(form, config) {
		return {
			rules: [
				{
					required: true,
					message: '此项为必填项',
				},
			]
		}
	},
	request: async () => {
		try {
			const rs = await regionStore.api.list(undefined);
			let select: TreeSelect[] = [];
			// level 1
			rs.map((value: Region) => {
				if (value.level == 1) {
					if (!value.name) return;
					select.push({ title: value.name, value: value.name, uid: value.uid, children: [] })
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
						treeSelect.children.push({ title: treeSelect.title + value.name, value: treeSelect.title + value.name, uid: value.uid, children: [] })
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
								treeSelect.children.push({ title: treeSelect.title + value.name, value: treeSelect.title + value.name, uid: value.uid, children: [] })
							}
						});
					}
				});
			});

			return select;

		} catch (e) {
			return [];
		}
	}
};

export const address: FormColumnsType = {
	dataIndex: 'address',
	title: '地址',
	hideInSearch: true,
	// valueType: 'mapInput',
	editable: false,

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
	dependencies: ['address'],
	fieldProps: (form) => {
		form.setFieldValue('map', form.getFieldValue('address'))
	}
};

export const store_status: FormColumnsType = {
	dataIndex: 'store_status',
	title: '门店状态开启',
	valueType: 'switch',
	hideInSearch: true,
	valueEnum: {
		true: false,
		false: true,
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
export const online_store_status: FormColumnsType = {
	dataIndex: 'online_store_status',
	title: '网店状态开启',
	valueType: 'switch',
	hideInSearch: true,
	valueEnum: {
		true: false,
		false: true,
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


export const business_days: FormColumnsType = {
	dataIndex: 'business_days',
	title: '营业时间',
	valueType: 'formList',
	hideInSearch: true,
	columns: [
		{
			dataIndex: 'days', valueType: 'checkbox', title: '营业日', valueEnum: {
				1: '周一',
				2: '周二',
				3: '周三',
				4: '周四',
				5: '周五',
				6: '周六',
				7: '周日'
			},
			formItemProps: {
				rules: [
					{
						required: true,
						message: '此项为必填项',
					},
				],
			}
		},
		{
			dataIndex: 'hours', valueType: 'timeRange', title: '时间段'
		}
	],
	formItemProps: {
		rules: [
			{
				required: true,
				message: '此项为必填项',
			}
		],
	},
};



export const logo: FormColumnsType = {
	title: '门店logo',
	dataIndex: 'logo',
	valueType: 'imageUpload',
	tooltip: '尺寸建议750x750像素以上，大小2M以下，最多1张,如果没有那么使用内部统一logo',
	fieldProps: {
		maxNumber: 1,
		name: 'upload',
		action: '/media-t/upload',
	}
};




export const admin_name: FormColumnsType = {
	title: '管理员姓名',
	dataIndex: 'admin_name',
	valueType: 'text',
	formItemProps: {
		rules: [
			{
				required: true,
				message: '此项为必填项',
			}
		],
	},
};


export const admin_account: FormColumnsType = {
	title: '管理员帐号',
	dataIndex: 'admin_account',
	valueType: 'text',
	formItemProps: {
		rules: [
			{
				required: true,
				message: '此项为必填项',
			},
			{
				min: 11,
				max: 11,
			}
		],
	},
};


export const contact: FormColumnsType = {
	title: '联系电话',
	dataIndex: 'contact',
	valueType: 'text',
	formItemProps: {
		rules: [
			{
				required: true,
				message: '此项为必填项',
			},
			{
				min: 11,
				max: 11,
			}
		],
	},
};

