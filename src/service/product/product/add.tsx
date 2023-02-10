import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';

import {
	brand_name, delete_status, name, new_status, product_category_main_name,
	product_category_second_name_dependency,
	product_sn, recommand_status,
	sort
} from './columns';

// kind: form
const addForm: FormProps = {
	onMount: (location, formRef, setDataObject) => {
		formRef.current?.resetFields();
	},
	unMount: (location, formRef) => {
		formRef.current?.resetFields();
	},
	layoutType: 'Form',
	columns: [
		name,
		brand_name,
		product_category_main_name,
		product_category_second_name_dependency,
		product_sn,
		delete_status,
		new_status,
		recommand_status,
		sort,
	],
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
			header: {
				title: '商品新增'
			}
		}
	},
});