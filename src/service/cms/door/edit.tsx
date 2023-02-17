import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { CmsDoor, cmsDoorStore } from '@/service/api/cmsDoor.store';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { cloneDeep, merge } from 'lodash';
import { parse } from 'querystring';
import { address, admin_account, admin_name, bmap, business_days, contact, first_name, logo, online_store_status, region_name, second_name, store_status } from './columns';

// kind: form
const editForm: FormProps = {
	onMount: ({ location, form, setDataObject }) => {
		form?.resetFields();
		if (location === undefined) return;
		const query: any = parse(location?.search.split('?')[1] || '');
		cmsDoorStore.api.get(query.id).
			then((rs: CmsDoor) => {
				setDataObject(rs);
				form?.setFieldsValue(rs);
			}).
			catch((e) => notification.error({ message: e }))
	},
	layoutType: 'Form',
	shouldUpdate: false,
	columns: [
		merge(cloneDeep(first_name), { fieldProps: { disabled: true } }),
		merge(cloneDeep(second_name), { fieldProps: { disabled: true } }),
		admin_name,
		contact,
		admin_account,
		logo,

		business_days,
		region_name,
		address,
		bmap,
		
	
		store_status,
		online_store_status,
	],
	onSubmit: ({ values, dataObject, handleClose }) => {
		let target: Partial<CmsDoor> = {
			logo: values.logo?.fileList[0].name,
			...values,
		};

		cmsDoorStore.update_one(dataObject, target, [
			'store_status', 'online_store_status', 'region_name', 'address', 'business_days', 'logo'
		]).
			then(() => {
				notification.success({ message: "保存成功" });
				history.push(`/cms/door`);
			})
			.catch((e) => notification.error(e))

		handleClose();
		return true
	}
};

pageManager.register('cms.door.edit', {
	page: {
		view: [{ kind: 'form', ...editForm }],
		container: {
			keepAlive: false,
		}
	},
	stores: [],
});