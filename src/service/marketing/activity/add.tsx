import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { MarketingActivity, Rule, marketingActivityApi } from '@/service/api/marketingActivity.store';
import { name_column, description, start_time, end_time, rule, merchant, global, state } from './column';

const addForm: FormProps = {
	onMount: ({ location, form, setDataObject }) => {
		form?.resetFields();
	},
	layoutType: 'Form',
	shouldUpdate: false,
	columns: [
		name_column,
		description,
		start_time,
		end_time,
		rule,
		merchant,
		global,
		state,
	],
	onSubmit: ({ formRef, values, handleClose }) => {
		let rule: Rule = {
			predicate: values.predicate.option,
			action: values.action.option
		}
		let item: Partial<MarketingActivity> = {
			name: values.name,
			description: values.description,
			merchant: values.merchant,
			start_time: Date.parse(values.start_time_format) / 1000,
			end_time: Date.parse(values.end_time_format) / 1000,
			global: values.global === 'true' ? true : false,
			rule: rule,
			state: Number(values.state),
		};

		marketingActivityApi.create(undefined, item).
			then(() => {
				notification.success({ message: "保存成功" });
				formRef.current?.resetFields();
				// 跳转至数据编辑页
				history.push(`/marketing/activity`)
			})
			.catch((e) => notification.error(e))
		handleClose();
		return true
	}
};

pageManager.register('marketing.activity.add', {
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