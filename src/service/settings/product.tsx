import { FormColumnsType, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { notification } from 'antd';
import { ProductSetting, productSettingApi, productSettingStore } from '../api/settings.store';

const pic_mode: FormColumnsType = {
	title: '商品图片模式',
	dataIndex: 'pic_mode',
	valueType: 'radio',
	initialValue: '1',
	formItemProps: {
		rules: [
			{
				required: true,
				message: '此项为必填项',
			},
		],
	},
	valueEnum: {
		0: '正方形模式',
		1: '长图模式',
	},
};

const product_comment_status: FormColumnsType = {
	title: '开启商品评论',
	dataIndex: 'product_comment_status',
	tooltip: "商品评论功能已开启，买家可对订单进行评论；商品有评价内容时，将在对应商详中展示",
	valueType: 'switch',
	initialValue: false,
	valueEnum: {
		false: false,
		true: true,
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



const auto_comment_day: FormColumnsType = {
	title: '买家交易成功多少天后自动评论',
	dataIndex: 'auto_comment_day',
	valueType: 'digit',
	initialValue: 7,
	formItemProps: {
		rules: [
			{
				required: true,
				message: '此项为必填项',
			},
		],
	},
};

const auto_comment_content: FormColumnsType = {
	title: '自动评价内容',
	dataIndex: 'auto_comment_content',
	valueType: 'textarea',
	formItemProps: {
		rules: [
			{
				required: true,
				message: '此项为必填项',
			},
		],
	},
};

const product_import_setting: FormColumnsType = {
	title: '商品导入后可售',
	dataIndex: 'product_import_setting',
	valueType: 'switch',
	initialValue: false,
	valueEnum: {
		false: '禁售',
		true: '可售',
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
const product_distribute_setting: FormColumnsType = {
	title: '商品分配后上架',
	dataIndex: 'product_distribute_setting',
	valueType: 'switch',
	initialValue: false,
	valueEnum: {
		false: '下架',
		true: '上架',
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

// kind: form
const defaultFrom: FormProps = {
	onMount: ({ form, setDataObject }) => {
		form?.resetFields();
		productSettingApi.get().then(rs => {
			setDataObject(rs)
			form?.setFieldsValue(rs);
		})

	},
	layoutType: 'Form',
	shouldUpdate: false,
	columns: [
		pic_mode,
		product_comment_status,
		auto_comment_day,
		auto_comment_content,
		product_import_setting,
		product_distribute_setting,
	],
	onSubmit: ({ formRef, values, dataObject, handleClose }) => {
		const target: Partial<ProductSetting> = values;

		console.log("dataObject", dataObject);
		productSettingStore.update_one(dataObject, target, ["pic_mode",
			"product_comment_status",
			"auto_comment_day",
			"auto_comment_content",
			"product_import_setting",
			"product_distribute_setting"
		])
			.then(() => { notification.success({ message: "保存成功" }); })
			.catch((e) => notification.error(e))


		handleClose();

		return true
	}
};

pageManager.register('setting.product', {
	page: {
		view: [{ kind: 'form', ...defaultFrom }],
		container: {
			keepAlive: false,
			header: {},
		},
	},
	stores: [],
});
