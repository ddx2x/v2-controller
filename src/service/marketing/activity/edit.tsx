import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { notification } from 'antd';
import { parse } from 'querystring';
import { name_column, description, start_time, end_time, rule, merchant, global, state } from './column';
import { MarketingActivity, Rule, marketingActivityApi, marketingActivityStore } from '@/service/api/marketingActivity.store';
import { history } from '@umijs/max';

let editName: any = name
editName.fieldProps ? editName.fieldProps['disabled'] = true : null;


// kind: form
const editForm: FormProps = {
	onMount: ({ location, form, setDataObject }) => {
		form?.resetFields();
		if (location === undefined) return;
		const query: any = parse(location?.search.split('?')[1] || '');

		marketingActivityApi.get(query.id).then((rs) => {
			setDataObject(rs);
			let predicate = {
				label: rs.rule?.predicate?.name,
				value: rs.rule?.predicate?.uid,
				option: rs.rule?.predicate
			}
			let action = {
				label: rs.rule?.action?.name,
				value: rs.rule?.action?.uid,
				option: rs.rule?.action
			}
			let data = {
				...rs,
				predicate: predicate,
				action: action,
				global: rs.global?.toString(),
				state: rs.state?.toString(),
			}

			form?.setFieldsValue(data);
		}).catch((e) => notification.error({ message: e }))

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
	onSubmit: ({ formRef, values, dataObject, handleClose }) => {
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

		marketingActivityStore.update_one(dataObject, item, ["name", "description", "merchant", "start_time", "end_time", "global", "rule", "state"]).
			then(() => {
				notification.success({ message: "保存成功" });
				formRef.current?.resetFields();
				// 跳转至数据编辑页
				history.push('/marketing/activity');
			})
			.catch((e) => notification.error(e))

		handleClose();
		return true
	}
};

pageManager.register('marketing.activity.edit', {
	page: {
		view: [{ kind: 'form', ...editForm }],
		container: {
			keepAlive: false,
		}
	},
	stores: [],
});