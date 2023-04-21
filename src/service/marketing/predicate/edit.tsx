import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { notification } from 'antd';
import { parse } from 'querystring';
import { history } from '@umijs/max';
import { name_column, key, value } from './column';
import { MarketingPredicate, marketingPredicateApi, marketingPredicateStore } from '@/service/api/marketingPredicate.store';

// kind: form
const editForm: FormProps = {
	onMount: ({ location, form, setDataObject }) => {
		form?.resetFields();
		if (location === undefined) return;
		const query: any = parse(location?.search.split('?')[1] || '');

		marketingPredicateApi.get(query.id).then((rs) => {
			setDataObject(rs);
			let data = {
				...rs,
				key: rs?.key?.toString(),

			}

			form?.setFieldsValue(data);
		}).catch((e) => notification.error({ message: e }))

	},
	layoutType: 'Form',
	shouldUpdate: false,
	columns: [
		name_column,
		key,
		value,
	],
	onSubmit: ({ formRef, values, dataObject, handleClose }) => {

		let item: Partial<MarketingPredicate> = {
			uid: dataObject.uid,
			name: values.name,
			key: Number(values.key),
			value: values.value,
		};

		marketingPredicateStore.update_one(dataObject, item, ["name", "key", "value"]).
			then(() => {
				notification.success({ message: "保存成功" });
				history.push(`/marketing/predicate`)
			})
			.catch((e) => {
				notification.error(e)
			})
		handleClose();
		return true
	}
};

pageManager.register('marketing.predicate.edit', {
	page: {
		view: [{ kind: 'form', ...editForm }],
		container: {
			keepAlive: false,
		}
	},
	stores: [],
});