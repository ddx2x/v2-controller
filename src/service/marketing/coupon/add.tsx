import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { MarketingActivity, Rule, marketingActivityApi } from '@/service/api/marketingActivity.store';
import { name_column, description, expire, max_claimable, perpetual, rule, merchant, global, state } from './column';
import { MarketingCoupon, marketingCouponApi } from '@/service/api/marketingCoupon.store';

const addForm: FormProps = {
	onMount: ({ location, form, setDataObject }) => {
		form?.resetFields();
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
	onSubmit: ({ formRef, values, handleClose }) => {
		let rule: Rule = {
			predicate: values.predicate.option,
			action: values.action.option
		}
		let item: Partial<MarketingCoupon> = {
			name: values.name,
			description: values.description,
			merchant: values.merchant,
			expire: Date.parse(values.expire_format) / 1000,
			perpetual: values.perpetual === 'true' ? true : false,
			global: values.global === 'true' ? true : false,
			rule: rule,
			state: Number(values.state),
			max_claimable: Number(values.max_claimable),
		};

		marketingCouponApi.create(undefined, item).
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

pageManager.register('marketing.coupon.add', {
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