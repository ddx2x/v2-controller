import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { MarketingAction, marketingActionApi } from '@/service/api/marketingAction.store';
import { name_column, op, value } from './column';

const addForm: FormProps = {
	onMount: ({ location, form, setDataObject }) => {
		form?.resetFields();
	},
	layoutType: 'Form',
	shouldUpdate: false,
	columns: [
		name_column,
		op,
		value,
	],
	onSubmit: ({ formRef, values, handleClose }) => {

		let item: Partial<MarketingAction> = {
			name: values.name,
			op: Number(values.op),
			value: Number(values.value),

		};

		marketingActionApi.create(undefined, item).
			then(() => {
				notification.success({ message: "保存成功" });
				formRef.current?.resetFields();
				// 跳转至数据编辑页
				history.push(`/marketing/action`)
			})
			.catch((e) => notification.error(e))
		handleClose();
		return true
	}
};

pageManager.register('marketing.action.add', {
	page: {
		view: [{ kind: 'form', ...addForm }],
		container: {
			keepAlive: false,
			header: {
				title: '折扣活动新增'
			}
		}
	},
	stores: [],
});