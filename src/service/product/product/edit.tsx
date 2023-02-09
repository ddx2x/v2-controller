import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { productApi } from '@/service/api/productProduct.store';
import { notification } from 'antd';
import { parse } from 'querystring';
import {
	brand_name, delete_status, name, new_status, product_category_name,
	product_sn, recommand_status,
	sort
} from './columns';



// kind: form
const editForm: FormProps = {
	onMount: (location, formRef, setDataObject) => {
		formRef.current?.resetFields();
		if (location === undefined) return;
		const query: any = parse(location?.search.split('?')[1] || '');
		productApi.get(query.id).
			then((rs) => {
				setDataObject(rs);
				// rs.first_letter = rs.first_letter;
				// rs.sort = String(rs.sort);
				// rs.factory_status = String(rs.factory_status || 0);
				// rs.show_status = String(rs.show_status);
				// rs.brand_story = rs.brand_story;
				// rs.big_pic_copy = {
				// 	fileList: [
				// 		{ name: rs.big_pic, url: "/media-t/file/" + rs.big_pic }
				// 	]
				// }
				// rs.logo_price = {
				// 	fileList: [
				// 		{ name: rs.logo, url: "/media-t/file/" + rs.logo }
				// 	]
				// }
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
		brand_name,
		product_category_name,
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

pageManager.register('product.product.edit', {
	page: {
		view: [{ kind: 'form', ...editForm }],
		container: {
			keepAlive: false,
		}
	},
	stores: [],
});