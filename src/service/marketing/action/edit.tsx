import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { notification } from 'antd';
import { parse } from 'querystring';
import { history } from '@umijs/max';
import { name_column, op, value } from './column';
import { MarketingAction, marketingActionApi, marketingActionStore } from '@/service/api/marketingAction.store';

let editName: any = name
editName.fieldProps ? editName.fieldProps['disabled'] = true : null;


// kind: form
const editForm: FormProps = {
	onMount: ({ location, form, setDataObject }) => {
		form?.resetFields();
		if (location === undefined) return;
		const query: any = parse(location?.search.split('?')[1] || '');

		marketingActionApi.get(query.id).then((rs) => {
			setDataObject(rs);

			let data = {
				...rs,
				op: rs?.op?.toString(),

			}

			form?.setFieldsValue(data);
		}).catch((e) => notification.error({ message: e }))

	},
	layoutType: 'Form',
	shouldUpdate: false,
	columns: [
		name_column,
		op,
		value,
	],
	onSubmit: ({ formRef, values, dataObject, handleClose }) => {

		let item: Partial<MarketingAction> = {
			uid: dataObject.uid,
			name: values.name,
			op: Number(values.op),
			value: values.value,
		};

		marketingActionStore.update_one(dataObject, item, ["name", "op", "value"]).
			then(() => {
				notification.success({ message: "保存成功" });
				formRef.current?.resetFields();
				history.push(`/marketing/action`)
				// 跳转至数据编辑页
			})
			.catch((e) => {
				notification.error(e)
			})
		handleClose();
		return true
	}
};

pageManager.register('marketing.action.edit', {
	page: {
		view: [{ kind: 'form', ...editForm }],
		container: {
			keepAlive: false,
		}
	},
	stores: [],
});