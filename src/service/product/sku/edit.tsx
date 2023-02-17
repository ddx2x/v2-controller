import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { StockKeepingUnit, StockKeepingUnitApi, stockKeepingUnitStore } from '@/service/api/productSKU.store';
import { history } from '@umijs/max';
import { message } from 'antd';
import { merge } from 'lodash';
import { parse } from 'querystring';
import {
	low_stock,
	pic,
	price,
	product_name,
	promotion_price,
	spec_name,
	stock
} from './columns';


// kind: form
const editForm: FormProps = {
	submitter: {
		resetButtonProps: false
	},
	onMount: ({ location, form, setDataObject }) => {
		form?.resetFields();
		if (location === undefined) return;
		const query: any = parse(location?.search.split('?')[1] || '');
		StockKeepingUnitApi
			.get(query.id)
			.then((r) => {
				setDataObject(r);
				form?.setFieldsValue(r);
			})
	},
	layoutType: 'Form',
	shouldUpdate: false,
	columns: [
		merge(product_name, { fieldProps: { disabled: true } }),
		merge(spec_name, { fieldProps: { disabled: true } }),
		pic,
		price,
		promotion_price,
		stock,
		low_stock,
	],
	onSubmit: ({ formRef, values, dataObject, handleClose }) => {
		const src: StockKeepingUnit = dataObject;
		const target: Partial<StockKeepingUnit> = values;

		stockKeepingUnitStore.update_one(src, target, ["price", "promotion_price", "stock", "low_stock", "pic"]).
			then(() => {
				message.success("保存成功");
				formRef.current?.resetFields();
				history.push(`/product/product/sku?product_id=${src.product_id}`);
			})
			.catch((e) => message.error(e))
		handleClose();
		return true
	}
};

pageManager.register('product.product.sku.edit', {
	page: {
		view: [{ kind: 'form', ...editForm }],
		container: {
			keepAlive: false,
		}
	},
	stores: [],
});