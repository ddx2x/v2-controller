import { FormColumnsType, FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { notification } from 'antd';
import { parse } from 'querystring';
import { Brand, brandApi, brandStore } from '../../api/productBrand.store';


const name: FormColumnsType = {
	title: '品牌名称',
	dataIndex: 'uid',
	valueType: 'text',
	fieldProps: {
		placeholder: '品牌名称',
		disabled: true,
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

const first_letter: FormColumnsType = {
	title: '首字母',
	dataIndex: 'first_letter',
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


const factory_status: FormColumnsType = {
	title: '显示品牌制造商',
	dataIndex: 'factory_status',
	valueType: 'radio',
	formItemProps: {
		rules: [
			{
				required: true,
				message: '此项为必填项',
			},
		],
	},
	valueEnum: {
		0: "否",
		1: "是",
	}

};


const show_status: FormColumnsType = {
	dataIndex: 'show_status',
	title: '显示品牌',
	valueType: 'radio',
	formItemProps: {
		rules: [
			{
				required: true,
				message: '此项为必填项',
			},
		],
	},
	valueEnum: {
		0: "否",
		1: "是",
	}
};


const sort: FormColumnsType = {
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
};




const big_pic: FormColumnsType = {
	dataIndex: 'big_pic_copy',
	title: '专区大图',
	valueType: 'imageUpload',
	tooltip: '尺寸建议750x750像素以上，大小2M以下，最多5张 (可拖拽图片调整显示顺序)',
	fieldProps: {
		maxNumber: 1,
		name: 'upload',
		action: '/media-t/upload',
	},
};


const logo: FormColumnsType = {
	dataIndex: 'logo_price',
	title: '品牌logo',
	valueType: 'imageUpload',
	tooltip: '尺寸建议750x750像素以上，大小2M以下，最多5张 (可拖拽图片调整显示顺序)',
	fieldProps: {
		maxNumber: 1,
		name: 'upload',
		action: '/media-t/upload',
	}
};


const brand_story: FormColumnsType = {
	dataIndex: 'brand_story',
	title: '品牌故事',
	valueType: 'textarea',
};


declare type Query = {
	id?: string;
};


// kind: form
const editForm: FormProps = {
	onMount: (location, formRef, setDataObject) => {
		formRef.current?.resetFields();
		if (location === undefined) return;
		const query: Query = parse(location?.search.split('?')[1] || '');
		brandApi.get(query.id).
			then((rs) => {
				setDataObject(rs);
				rs.uid = query.id || "";
				rs.first_letter = rs.first_letter;
				rs.sort = String(rs.sort);
				rs.factory_status = String(rs.factory_status || 0);
				rs.show_status = String(rs.show_status);
				rs.brand_story = rs.brand_story;
				rs.big_pic_copy = {
					fileList: [
						{ name: rs.big_pic, url: "/media-t/file/" + rs.big_pic }
					]
				}
				rs.logo_price = {
					fileList: [
						{ name: rs.logo, url: "/media-t/file/" + rs.logo }
					]
				}
				formRef.current?.setFieldsValue(rs);
			}).
			catch((e) => notification.error({ message: e }))
	},
	unMount: (location, formRef) => {
		formRef.current?.resetFields();
	},
	layoutType: 'Form',
	shouldUpdate: false,
	columns: [
		name,
		first_letter,
		factory_status,
		show_status,
		sort,
		logo,
		big_pic,
		brand_story,
	],
	onSubmit: (formRef, values, dataObject, handleClose) => {
		const target: Partial<Brand> = {
			first_letter: values.first_letter,
			factory_status: Number(values.factory_status),
			show_status: Number(values.show_status),
			logo: values.logo_price?.fileList[0].name || "",
			big_pic: values.big_pic_copy?.fileList[0].name || "",
			brand_story: values.brand_story,
			sort: Number(values.sort),
		};
		brandStore.update_one(dataObject, target, ["first_letter", "factory_status", "logo", "big_pic", "brand_story", "sort"]).
			then(() => { notification.success({ message: "保存成功" }); })
			.catch((e) => notification.error(e))

		handleClose();
		return true
	}
};

pageManager.register('product.brand.edit', {
	page: {
		view: [{ kind: 'form', ...editForm }],
		container: {
			keepAlive: false,
		}
	},
	stores: [],
});