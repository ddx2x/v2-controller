import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { StockKeepingUnit } from '@/service/api/productSKU.store';
import {
	low_stock,
	price,
	product_name,
	promotion_price,
	spec_name,
	stock
} from './columns';

// kind: form
const addForm: FormProps = {
	layoutType: 'Form',
	columns: [
		product_name,
		spec_name,
		price,
		promotion_price,
		stock,
		low_stock,
	],
	onSubmit: ({ values, handleClose }) => {
		let target: Partial<StockKeepingUnit> = {
			...values,
		};
		// target.promotion_type = values.promotion_type?.map((item: any) => Number(item));
		// target.product_category_name = values.product_category_name;
		// target.delete_status = Number(values.delete_status);
		// target.new_status = Number(values.new_status);
		// target.recommand_status = Number(values.recommand_status);
		// target.sort = Number(values.sort);
		// target.publish_status = Number(target.publish_status || 0);
		// target.verify_status = Number(target.verify_status || 0);
		// target.delete_status = Number(target.delete_status || 0);
		// target.album_pics = values.album_pics?.fileList?.map((file: { name: any; }) => file.name) || [],

		// 	productStore.create(target).
		// 		then((rs) => {
		// 			notification.success({ message: "保存成功" });
		// 			history.push(`/product/product/edit?id=` + rs.getUid());
		// 		})
		// 		.catch((e) => notification.error(e))

		handleClose();
		return true
	}
};

pageManager.register('product.product.sku.add', {
	page: {
		view: [{ kind: 'form', ...addForm }],
		container: {
			keepAlive: false,
			header: {
				title: '货存新增'
			}
		}
	},
});