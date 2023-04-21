import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { name_column, key, value } from './column';
import { MarketingPredicate, marketingPredicateApi } from '@/service/api/marketingPredicate.store';

const addForm: FormProps = {
	onMount: ({ location, form, setDataObject }) => {
		form?.resetFields();
	},
	layoutType: 'Form',
	shouldUpdate: false,
	columns: [
		name_column,
		key,
		value,
	],
	onSubmit: ({ formRef, values, handleClose }) => {

		let item: Partial<MarketingPredicate> = {
			name: values.name,
			key: Number(values.key),
			value: Number(values.value),
		};

		marketingPredicateApi.create(undefined, item).
			then(() => {
				notification.success({ message: "保存成功" });
				formRef.current?.resetFields();
				// 跳转至数据编辑页
				history.push(`/marketing/predicate`)
			})
			.catch((e) => notification.error(e))
		handleClose();
		return true
	}
};

pageManager.register('marketing.predicate.add', {
	page: {
		view: [{ kind: 'form', ...addForm }],
		container: {
			keepAlive: false,
			header: {
				title: '匹配规则新增'
			}
		}
	},
	stores: [],
});