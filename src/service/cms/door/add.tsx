import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { CmsDoor, cmsDoorStore } from '@/service/api/cmsDoor.store';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { cloneDeep, merge } from 'lodash';
import { address, bmap, business_days, first_name, online_store_status, region_name, second_name, store_status } from './columns';

// kind: form
const form: FormProps = {
	onMount: ({ form }) => {
		form?.resetFields();
	},
	layoutType: 'Form',
	shouldUpdate: false,
	columns: [
		merge(cloneDeep(first_name), { fieldProps: { disabled: false } }),
		merge(cloneDeep(second_name), { fieldProps: { disabled: false } }),
		business_days,
		region_name,
		address,
		bmap,
		store_status,
		online_store_status,
	],
	onSubmit: ({ formRef, values, handleClose }) => {
		let item: Partial<CmsDoor> = values;

		cmsDoorStore.api.create(undefined, item).
			then(() => {
				notification.success({ message: "保存成功" });
				formRef.current?.resetFields();
				history.push(`/cms/door`);
			})
			.catch((e) => notification.error(e))

		handleClose();
		return true
	}
};

pageManager.register('cms.door.add', {
	page: {
		view: [{ kind: 'form', ...form }],
		container: {
			keepAlive: false,
		}
	},
	stores: [],
});