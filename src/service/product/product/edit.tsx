import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { Product, productApi, productStore } from '@/service/api/productProduct.store';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { merge } from 'lodash';
import { parse } from 'querystring';
import {
	album_pics,
	brand_name,
	keywords, low_stock, name, new_status, product_category_name,
	product_sn, promotion_end_time, promotion_per_limit, promotion_start_time, promotion_type, publish_status, recommand_status,
	service_ids,
	sort,
	sub_title,
	unit
} from './columns';

// kind: form
const editForm: FormProps = {
	onMount: (location, formRef, setDataObject) => {
		formRef.current?.resetFields();
		if (location === undefined) return;
		const query: any = parse(location?.search.split('?')[1] || '');
		productApi.get(query.id).
			then((rs: Product) => {
				setDataObject(rs);

				rs.delete_status = String(rs.delete_status);
				rs.publish_status = String(rs.publish_status);
				rs.new_status = String(rs.new_status);
				rs.recommand_status = String(rs.recommand_status);
				rs.sort = String(rs.sort);


				
				// gift_growth: number | string | undefined
				// gift_point: number | string | undefined
				// use_point_limit: string | undefined | number
				// sub_title: string | undefined | number
				// description: string | undefined | number
				// original_price: string | undefined | number
				// stock: string | undefined | number
				// low_stock: string | undefined | number
				// unit: string | undefined | number
				// weight: string | undefined | number
				// preview_status: string | undefined | number
				// service_ids: string | undefined | number
				// keywords: string | undefined | number
				// note: string | undefined | number
				// album_pics: string | undefined | number


				// promotion_price: number | string | undefined
				// promotion_start_time: string | undefined | number
				// promotion_end_time: string | undefined | number
				// promotion_per_limit: string | undefined | number
				// promotion_type: string | undefined | number



				rs.album_pics = {
					fileList: rs.album_pics?.map((pic: any) => {
						return { name: pic, url: "/media-t/file/" + pic }
					}) || []
				};

				console.log("edit album_pics", rs.album_pics);

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
		merge(sub_title, { fieldProps: { disabled: true } }),
		merge(name, { fieldProps: { disabled: true } }),
		merge(brand_name, { fieldProps: { disabled: true } }),
		merge(product_category_name, { fieldProps: { disabled: true } }),
		publish_status,
		merge(product_sn, { fieldProps: { disabled: true } }),
		service_ids,
		keywords,
		unit,
		new_status,
		recommand_status,

		album_pics,

		promotion_type,
		promotion_start_time,
		promotion_end_time,
		promotion_per_limit,

		low_stock,
		sort,

	],
	onSubmit: (formRef, values, dataObject, handleClose) => {
		let target: Partial<Product> = {
			// first_letter: values.first_letter,
			// factory_status: Number(values.factory_status),
			// show_status: Number(values.show_status),
			album_pics: values.album_pics?.fileList?.map((file: { name: any; }) => file.name) || [],
			// big_pic: values.big_pic_copy?.fileList[0].name || "",
			// brand_story: values.brand_story,
			// sort: Number(values.sort),
		};


		console.log("dataObject", dataObject);

		productStore.update_one(dataObject, target, ["album_pics"]).
			then(() => {
				notification.success({ message: "保存成功" });
				history.push(`/product/product`);
			})
			.catch((e) => notification.error(e))

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