import { FormColumnsType, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { parse } from 'querystring';
import { Category, categoryApi } from '../../api/productCategory.store';

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





const keywords: FormColumnsType = {
	dataIndex: 'keywords',
	title: '关键字',
	valueType: 'select',
	fieldProps: {
		mode: "tags",
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

const description: FormColumnsType = {
	dataIndex: 'description',
	title: '描述',
	valueType: 'textarea',
	fieldProps: {
		mode: "tags",
	},
};

const predicate: FormColumnsType = {
	dataIndex: 'predicate',
	title: '判定',
};

const action: FormColumnsType = {
	dataIndex: 'action',
	title: '操作',
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

declare type Query = {
	id?: string;
};


// kind: form
const addForm: FormProps = {
	onMount: ({ location, form, setDataObject }) => {
		form?.resetFields();
		if (location === undefined) return;
		const query: Query = parse(location?.search.split('?')[1] || '');
		form?.setFieldsValue({ "category_id": query.id });
	},
	layoutType: 'Form',
	shouldUpdate: false,
	columns: [
		name,
		start_time,
		end_time,
		keywords,
		description,
		rule
	],
	onSubmit: ({ formRef, values, handleClose }) => {
		let item: Partial<Category> = {
			uid: values.uid,
			level: Number(values.level),
			parent_id: values.parent_id || "",
			full_id: values.full_id || "",
			nav_status: Number(values.nav_status),
			keywords: values.keywords,
			description: values.description || "",
		};

		categoryApi.create(undefined, item).
			then(() => {
				notification.success({ message: "保存成功" });
				formRef.current?.resetFields();
				// 跳转至数据编辑页
				history.push(`/product/category`)
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