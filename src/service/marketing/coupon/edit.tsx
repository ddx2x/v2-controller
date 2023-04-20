import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { notification } from 'antd';
import { parse } from 'querystring';
import { name_column, description, expire, rule, merchant, global, state, max_claimable, perpetual } from './column';
import { history } from '@umijs/max';
import { MarketingCoupon, Rule, marketingCouponApi, marketingCouponStore } from '@/service/api/marketingCoupon.store';

let editName: any = name
editName.fieldProps ? editName.fieldProps['disabled'] = true : null;


// kind: form
const editForm: FormProps = {
	onMount: ({ location, form, setDataObject }) => {
		form?.resetFields();
		if (location === undefined) return;
		const query: any = parse(location?.search.split('?')[1] || '');

		marketingCouponApi.get(query.id).then((rs) => {
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
				perpetual: rs.perpetual?.toString(),
			}

			form?.setFieldsValue(data);
		}).catch((e) => notification.error({ message: e }))

	},
	layoutType: 'Form',
	shouldUpdate: false,
	columns: [
		name_column,
		description,
		max_claimable,
		expire,
		rule,
		merchant,
		perpetual,
		global,
		state,
	],
	onSubmit: ({ formRef, values, dataObject, handleClose }) => {
		let rule: Rule = {
			predicate: values.predicate.option,
			action: values.action.option
		}
		let item: Partial<MarketingCoupon> = {
			name: values.name,
			description: values.description,
			merchant: values.merchant,
			expire: Date.parse(values.expire_format) / 1000,
			global: values.global === 'true' ? true : false,
			rule: rule,
			state: Number(values.state),
			perpetual: values.perpetual === 'true' ? true : false,
			max_claimable: values.max_claimable,
		};

		marketingCouponStore.update_one(dataObject, item, ["name", "description", "max_claimable", "expire", "rule", "merchant", "perpetual", "state", "global"]).
			then(() => {
				notification.success({ message: "保存成功" });
				formRef.current?.resetFields();
				// 跳转至数据编辑页
				history.push(`/marketing/coupon`)
			})
			.catch((e) => notification.error(e))

		handleClose();
		return true
	}
};

pageManager.register('marketing.coupon.edit', {
	page: {
		view: [{ kind: 'form', ...editForm }],
		container: {
			keepAlive: false,
		}
	},
	stores: [],
});