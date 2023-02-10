import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { Product, productStore } from '@/service/api/productProduct.store';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { cloneDeep } from 'lodash';
import {
	brand_name, delete_status, name, new_status, product_category_main_name,
	product_category_second_name_dependency,
	product_sn, recommand_status,
	sort,
	sub_title
} from './columns';


// let sub_time_editable = sub_title;
// sub_time_editable.fieldProps ? sub_time_editable.fieldProps["disabled"] = false : null;

console.log("sub_title_editable", sub_title);

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
		cloneDeep(sub_title),
		cloneDeep(name),
		cloneDeep(brand_name),
		cloneDeep(product_category_main_name),
		product_category_second_name_dependency,
		cloneDeep(product_sn),
		delete_status,
		new_status,
		recommand_status,
		sort,
	],
	onSubmit: (formRef, values, dataObject, handleClose) => {
		let target: Partial<Product> = {
			...values,
		};
		target.delete_status = Number(values.delete_status);
		target.new_status = Number(values.new_status);
		target.recommand_status = Number(values.recommand_status);
		target.sort = Number(values.sort);
		target.publish_status = Number(1);
		target.verify_status = Number(1);

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