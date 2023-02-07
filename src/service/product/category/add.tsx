import { FormColumnsType, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { parse } from 'querystring';

const name: FormColumnsType = {
	title: '类型名称',
	dataIndex: 'uid',
	valueType: 'text',
	fieldProps: {
		placeholder: '请输入分类名称',
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


const parent_id: FormColumnsType = {
	title: '上级分类的编号',
	dataIndex: 'parent_id',
	tooltip: "空表示一级分类",
	valueType: 'text',
	fieldProps: {
		placeholder: '请输入分类名称',
	},
};

const level: FormColumnsType = {
	title: '分类级别',
	dataIndex: 'level',
	valueType: 'digit',
	initialValue: 2,
	fieldProps: {
		min: 1,
		max: 2
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


const nav_status: FormColumnsType = {
	title: '是否显示在导航栏',
	dataIndex: 'nav_status',
	valueType: 'radio',
	initialValue: "0",
	formItemProps: {
		rules: [
			{
				required: true,
				message: '此项为必填项',
			},
		],
	},
	valueEnum: {
		0: "不显示",
		1: "显示",
	}

};


const show_status: FormColumnsType = {
	dataIndex: 'show_status',
	title: '显示状态',
	valueType: 'radio',
	initialValue: "0",
	formItemProps: {
		rules: [
			{
				required: true,
				message: '此项为必填项',
			},
		],
	},
	valueEnum: {
		0: "不显示",
		1: "显示",
	}
};


const icon: FormColumnsType = {
	dataIndex: 'icon',
	title: '图标',
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


const sort: FormColumnsType = {
	dataIndex: 'sort',
	title: '排序',
	valueType: 'digit',
	initialValue: 99,
	fieldProps: {
		min: 1,
		max: 99,
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


declare type Query = {
	id?: string;
};


// kind: form
const addForm: FormProps = {
	onMount: (location, formRef, setDataObject) => {
		formRef.current?.resetFields();
		if (location === undefined) return;
		const query: Query = parse(location?.search.split('?')[1] || '');
		formRef.current?.setFieldsValue({ "category_id": query.id });
	},
	unMount: (location, formRef) => {
		formRef.current?.resetFields();
	},
	layoutType: 'Form',
	shouldUpdate: false,
	columns: [
		name,
		level,
		parent_id,
		nav_status,
		show_status,
		sort,
		icon,
		keywords,
		description,
	],
	onSubmit: (formRef, values, dataObject, handleClose) => {
		// let item: Partial<ProductAttribute> = {
		// 	name: values.name,
		// 	category_id: values.category_id,
		// 	select_type: Number(values.select_type),
		// 	input_type: Number(values.input_type),
		// 	input_select_list: values.input_select_list,
		// 	sort: Number(values.sort),
		// 	filter_type: Number(values.filter_type),
		// 	search_type: Number(values.search_type),
		// 	related_status: Number(values.related_status),
		// 	hand_add_status: Number(values.hand_add_status),
		// 	type: Number(values.type),
		// };

		// productAttributeStore.api.create(undefined, item).
		// 	then(() => { notification.success({ message: "保存成功" }); })
		// 	.catch((e) => notification.error(e))

		handleClose();
		return true
	}
};

pageManager.register('product.category.add', {
	page: {
		view: [{ kind: 'form', ...addForm }],
	},
	stores: [],
});