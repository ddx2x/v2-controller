import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { brandApi } from '../brand';
import { categoryApi } from '../category';

const columns = [
	{
		dataIndex: 'name',
		title: '商品名称',
		hideInSearch: true,
		fieldProps: {
			placeholder: '请输入分类名称',
		},
		formItemProps: {
			rules: [
				{
					required: true,
					message: '此项为必填项',
				},
				{
					message: '最小1个字符最大64',
					type: 'string',
					min: 1,
					max: 64
				}
			],
		},
	},
	{
		dataIndex: 'brand_name',
		title: '品牌名称',
		hideInSearch: true,
		valueTyep: "select",
		fieldProps: {
			placeholder: '请选择品牌名称',
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
				const rs = await brandApi
					.list(undefined, { limit: { page: 0, size: 500 }, sort: { version: 1 } });
				let select: any = [];
				rs.map((value) => { select.push({ label: value.uid, value: value.uid }); });
				return select;
			} catch (e) {
				return [];
			}
		}
	},
	{
		dataIndex: 'product_category_name',
		title: '产品分类',
		hideInSearch: true,
		fieldProps: {
			placeholder: '请输入产品分类',

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
				const rs = await categoryApi
					.list(undefined, { limit: { page: 0, size: 500 }, sort: { version: 1 }, filter: { level: 2 } });
				let select: any = [];
				rs.map((value) => { select.push({ label: value.uid, value: value.uid }); });
				return select;
			} catch (e) {
				return [];
			}
		}
	},
	{
		dataIndex: 'product_sn',
		title: '货号',
		fieldProps: {
			placeholder: '请输入货号',

		},
		hideInSearch: true,
		formItemProps: {
			rules: [
				{
					required: true,
					message: '此项为必填项',
				},
			],
		},
	},
	{
		dataIndex: 'delete_status',
		title: '删除状态',
		hideInSearch: true,
		editable: false,
		valueType: "radio",
		valueEnum: {
			0: "未删除",
			1: "已删除"
		},
		formItemProps: {
			rules: [
				{
					required: true,
					message: '此项为必填项',
				},
			],
		},
	},
	{
		dataIndex: 'new_status',
		title: '新品状态',
		hideInSearch: true,
		editable: false,
		valueType: "radio",
		valueEnum: {
			0: "不是新品",
			1: "新品"
		},
		formItemProps: {
			rules: [
				{
					required: true,
					message: '此项为必填项',
				},
			],
		},
	},

	{
		dataIndex: 'recommand_status',
		title: '推荐状态',
		hideInSearch: true,
		valueType: "radio",
		valueEnum: {
			0: "不推荐",
			1: "推荐"
		},
		formItemProps: {
			rules: [
				{
					required: true,
					message: '此项为必填项',
				},
			],
		},
	},
	{
		dataIndex: 'sort',
		title: '排序',
		valueType: 'digit',
		initialValue: 1,
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
	},
]
declare type Query = {
	id?: string;
};


// kind: form
const addForm: FormProps = {
	onMount: (location, formRef, setDataObject) => {
		formRef.current?.resetFields();
	},
	unMount: (location, formRef) => {
		formRef.current?.resetFields();
	},
	layoutType: 'Form',
	shouldUpdate: false,
	columns: columns,
	onSubmit: (formRef, values, dataObject, handleClose) => {
		// const target: Partial<Brand> = {
		// 	first_letter: values.first_letter,
		// 	factory_status: Number(values.factory_status),
		// 	show_status: Number(values.show_status),
		// 	logo: values.logo_price?.fileList[0].name || "",
		// 	big_pic: values.big_pic_copy?.fileList[0].name || "",
		// 	brand_story: values.brand_story,
		// 	sort: Number(values.sort),
		// };
		// brandStore.update_one(dataObject, target, ["first_letter", "factory_status", "logo", "big_pic", "brand_story", "sort"]).
		// 	then(() => { notification.success({ message: "保存成功" }); })
		// 	.catch((e) => notification.error(e))

		handleClose();
		return true
	}
};

pageManager.register('product.product.add', {
	page: {
		view: [{ kind: 'form', ...addForm }],
		container: {
			keepAlive: false,
		}
	},
	stores: [],
});