import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { Product, productStore } from '@/service/api/productProduct.store';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { cloneDeep } from 'lodash';
import {
	album_pics,
	brand_name,
	default_test,
	details,
	keywords,
	name, new_status, product_category_name,
	product_sn, promotion_end_time, promotion_per_limit, promotion_start_time, promotion_type,
	recommand_status,
	service_ids,
	sort,
	sub_title,
	unit
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
		cloneDeep(product_category_name),
		
		cloneDeep(sub_title),
		cloneDeep(name),
		cloneDeep(brand_name),
		cloneDeep(product_sn),
		default_test,
		new_status,
		recommand_status,
		

		service_ids,
		keywords,
		unit,
		sort,

		promotion_type,
		promotion_start_time,
		promotion_end_time,
		promotion_per_limit,
		default_test,	


		album_pics,
		details,
	],
	onSubmit: (formRef, values, dataObject, handleClose) => {
		let target: Partial<Product> = {
			...values,
		};
		target.promotion_type = values.promotion_type?.map((item: any) => Number(item));
		target.product_category_name = values.product_category_name;
		target.delete_status = Number(values.delete_status);
		target.new_status = Number(values.new_status);
		target.recommand_status = Number(values.recommand_status);
		target.sort = Number(values.sort);
		target.publish_status = Number(target.publish_status || 0);
		target.verify_status = Number(target.verify_status || 0);
		target.delete_status = Number(target.delete_status || 0);
		target.album_pics = values.album_pics?.fileList?.map((file: { name: any; }) => file.name) || [],

			productStore.create(target).
				then((rs) => {
					notification.success({ message: "保存成功" });
					history.push(`/product/product/edit?id=` + rs.getUid());
				})
				.catch((e) => notification.error(e))

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