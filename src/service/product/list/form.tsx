import { FormColumnsType, StepFormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { parse } from 'querystring';
import { Commodity, commodityApi } from './store';

let aggregateSteps = [
	{ title: '基本信息' },
	{ title: '交付设置' },
	{ title: '图文详情' },
];

let singleSteps = [
	{ title: '商品信息' },
	{ title: '单品信息' },
	{ title: '图文详情' },
];

let commodityType: FormColumnsType = {
	title: '商品类型',
	dataIndex: 'type',
	valueType: 'radio',
	initialValue: 1,
	valueEnum: {
		1: '实物商品（物流发货）',
		2: '实物商品（跨境海淘）',
		3: '虚拟商品 （通用）',
		4: '虚拟商品 （付费券）',
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

let salesChannels: FormColumnsType = {
	title: '销售渠道',
	dataIndex: 'salesChannels',
	valueType: 'checkbox',
	initialValue: [],
	valueEnum: {
		1: '线上销售',
		2: '线下销售',
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

let salesModel: FormColumnsType = {
	title: '销售模式',
	dataIndex: 'salesModel',
	valueType: 'radio',
	initialValue: 1,
	valueEnum: {
		1: '现货销售',
		2: '预售模式（商家设置商品预售数量，各门店需自行修改预售数量）',
		3: '抽签模式',
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

let commodityName: FormColumnsType = {
	title: '商品名称',
	dataIndex: 'name',
	valueType: 'text',
	fieldProps: {
		placeholder: '请输入商品的名称',
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



let deliveryMethod: FormColumnsType = {
	title: '配送方式',
	dataIndex: 'deliveryMethod',
	initialValue: [1, 2],
	valueType: 'checkbox',
	valueEnum: {
		1: '商家配送',
		2: '到店自提',
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

let singleName: FormColumnsType = {
	title: '单品名称',
	dataIndex: 'name',
	valueType: 'text',
	fieldProps: {
		placeholder: '请输入单品的名称',
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


let bMap: FormColumnsType = {
	title: '地图定位',
	dataIndex: 'map',
	valueType: 'map',
	fieldProps: (form: any) => {
		if (!form.getFieldValue('address') && form.getFieldValue('map')) {
			form.setFieldValue('address', form.getFieldValue('map'))
		}
	}
}

export const singleAddStepForm: StepFormProps = {
	mount: (location, formRef) => {
		let data = location?.search.split('?')[1] || '';
		location?.search && formRef.current?.setFieldsValue({ commodityName: data });
	},
	unMount: (location, formRef) => {
		formRef.current?.resetFields();
	},
	steps: singleSteps,
	columns: [
		[
			commodityName,
			commodityType,
			salesChannels,
			salesModel,
			// commodityPrice
		],
		[
			singleName
		],
		[],
	],
};

pageManager.register('commdity.list.add', {
	page: {
		view: [{ kind: 'stepForm', ...singleAddStepForm }],
		container: {
			keepAlive: true,
			header: {
				title: '单品新增',
			},
		},
	},
	stores: [],
});

export declare type Query = {
	name?: string;
};

export const singleEditView: StepFormProps = {
	mount: (location, formRef) => {
		console.log('location?.search', location?.search, formRef);
		let data = location?.search.split('?')[1] || '';
		let query: Query = parse(data);
		commodityApi.get(query.name).then((item: Commodity) => {
			location?.search &&
				formRef.current?.setFieldsValue({
					name: item.name,
					types: item.type,
				});
		});
	},
	unMount: (location, formRef) => {
		formRef.current?.resetFields();
	},
	steps: singleSteps,
	columns: [
		[
			{
				title: '地图',
				dataIndex: 'map',
				valueType: 'map',
			},
			commodityName,
			commodityType,
			salesChannels,
			salesModel,
			{
				title: '商品图片',
				dataIndex: 'images',
				valueType: 'imageUpload',
				tooltip: '尺寸建议750x750像素以上，大小2M以下，最多5张 (可拖拽图片调整显示顺序)',
				fieldProps: {
					name: 'upload',
					action: '/api/images/upload',
				},
			}
		],
		[],
		[],
	],
};

pageManager.register('commdity.list.aggregate_edit', {
	page: {
		view: [{ kind: 'stepForm', ...singleEditView }],
		container: {
			keepAlive: false,
			header: {
				title: '单品编辑',
			},
		},
	},
	stores: [],
});

export const aggregateAddStepForm: StepFormProps = {
	mount: (location, formRef) => {
		let data = location?.search.split('?')[1] || '';
		// location?.search && formRef.current?.setFieldsValue({});
		formRef.current?.setFieldsValue({
			editor: '12345',
			map: '广州市天河区时代E-PARK',
		})
	},
	unMount: (location, formRef) => {
		formRef.current?.resetFields();
	},
	shouldUpdate: false,
	steps: aggregateSteps,
	columns: [
		[
			commodityName,
			commodityType,
			salesChannels,
			salesModel,
			{
				title: '商品图片',
				dataIndex: 'images',
				valueType: 'imageUpload',
				tooltip: '尺寸建议750x750像素以上，大小2M以下，最多5张 (可拖拽图片调整显示顺序)',
				fieldProps: {
					name: 'upload',
					action: '/api/images/upload',
				},
			},
			bMap,
			{
				title: '地址',
				dataIndex: 'address',
				valueType: 'text',
			},
		],
		[
			deliveryMethod
		],
		[],
	],
};

pageManager.register('product.list.aggregate_add', {
	page: {
		view: [{ kind: 'stepForm', ...aggregateAddStepForm }],
		container: {
			keepAlive: false,
			header: {
				title: '商品添加',
			},
		},
	},
	stores: [],
});
