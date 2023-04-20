import { FormColumnsType, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { parse } from 'querystring';
import { marketingPredicateApi } from '@/service/api/marketingPredicate.store';
import { marketingActionApi } from '@/service/api/marketingAction.store';
import { MarketingActivity, marketingActivityApi } from '@/service/api/marketingActivity.store';

const name: FormColumnsType = {
	title: '活动名称',
	dataIndex: 'name',
	valueType: 'text',
	fieldProps: {
		placeholder: '请输入活动名称',
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

const start_time: FormColumnsType = {
	title: '开始时间',
	dataIndex: 'start_time',
	valueType: 'dateTime',
	formItemProps: {
		rules: [
			{
				required: true,
				message: '此项为必填项',
			},
		],
	},
};

const end_time: FormColumnsType = {
	title: '结束时间',
	dataIndex: 'end_time',
	valueType: 'dateTime',
	formItemProps: {
		rules: [
			{
				required: true,
				message: '此项为必填项',
			},
		],
	},
};

const predicate: FormColumnsType = {
	dataIndex: 'predicate',
	title: '判定条件',
	valueType: 'select',
	formItemProps: {
		rules: [
			{
				required: true,
				message: '此项为必填项',
			},
		],
	},
	fieldProps: {
		placeholder: '请选择判定条件',
	},
	request: async () => {
		try {
			const predicate = await marketingPredicateApi.list(undefined, {
				limit: { page: 0, size: 500 },
				sort: { version: 1 },
			});
			let select: any = [];
			predicate.map((value) => {
				select.push({ label: value.name, value: value.uid });
			});
			return select;
		} catch (e) {
			return [];
		}
	},
};

const action: FormColumnsType = {
	dataIndex: 'action',
	title: '满减操作',
	valueType: 'select',
	fieldProps: {
		placeholder: '请选择满减操作',
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
			const predicate = await marketingActionApi.list(undefined, {
				limit: { page: 0, size: 500 },
				sort: { version: 1 },
			});
			let select: any = [];
			predicate.map((value) => {
				select.push({ label: value.name, value: value.uid });
			});
			return select;
		} catch (e) {
			return [];
		}
	},
};

const rule: FormColumnsType = {
	title: '规则',
	dataIndex: 'rule',
	valueType: 'group',
	columns: [
		predicate,
		action
	],
}

const global: FormColumnsType = {
	title: '是否全局应用到商城',
	dataIndex: 'global',
	valueType: 'select',
	formItemProps: {
		rules: [
			{
				required: true,
				message: '此项为必填项',
			},
		],
	},
	valueEnum: {
		true: '是',
		false: '否',

	},
}

declare type Query = {
	id?: string;
};


// kind: form
const addForm: FormProps = {
	onMount: ({ location, form, setDataObject }) => {
		form?.resetFields();
	},
	layoutType: 'Form',
	shouldUpdate: false,
	columns: [
		name,
		start_time,
		end_time,
		rule,
		global

	],
	onSubmit: ({ formRef, values, handleClose }) => {
		let item: Partial<MarketingActivity> = {
			...values,
			start_time: Date.parse(values.start_time) / 1000,
			end_time: Date.parse(values.end_time) / 1000,
		};

		marketingActivityApi.create(undefined, item).
			then(() => {
				notification.success({ message: "保存成功" });
				formRef.current?.resetFields();
				// 跳转至数据编辑页
				history.push(`/marketing/activity`)
			})
			.catch((e) => notification.error(e))
		handleClose();
		return true
	}
};

pageManager.register('marketing.activity.add', {
	page: {
		view: [{ kind: 'form', ...addForm }],
		container: {
			keepAlive: false,
			header: {
				title: '折扣活动新增'
			}
		}
	},
	stores: [],
});