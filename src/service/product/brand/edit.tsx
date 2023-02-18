import { FormProps } from '@/dynamic-components';
import { pageManager } from '@/dynamic-view';
import { notification } from 'antd';
import { parse } from 'querystring';
import { Brand, brandApi, brandStore } from '../../api/productBrand.store';
import {
	big_pic,
	brand_story, factory_status, first_letter, logo, name, show_status,
	sort
} from './columns';

let editName: any = name
editName.fieldProps ? editName.fieldProps['disabled'] = true : null;


// kind: form
const editForm: FormProps = {
	onMount: ({ location, form, setDataObject }) => {
		form?.resetFields();
		if (location === undefined) return;
		const query: any = parse(location?.search.split('?')[1] || '');
		brandApi.get(query.id).
			then((rs) => {
				setDataObject(rs);
				rs.uid = query.id || "";
				rs.first_letter = rs.first_letter;
				rs.sort = String(rs.sort);
				rs.factory_status = String(rs.factory_status || 0);
				rs.show_status = String(rs.show_status);
				rs.brand_story = rs.brand_story;
				form?.setFieldsValue(rs);
			}).
			catch((e) => notification.error({ message: e }))
	},
	layoutType: 'Form',
	shouldUpdate: false,
	columns: [
		editName,
		first_letter,
		factory_status,
		show_status,
		sort,
		logo,
		big_pic,
		brand_story,
	],
	onSubmit: ({ formRef, values, dataObject, handleClose }) => {
		const target: Partial<Brand> = {
			first_letter: values.first_letter,
			factory_status: Number(values.factory_status),
			show_status: Number(values.show_status),
			logo: values.logo?.fileList[0].name || "",
			big_pic: values.big_pic?.fileList[0].name || "",
			brand_story: values.brand_story,
			// sort: Number(values.sort),
		};
		brandStore.update_one(dataObject, target, ["first_letter", "factory_status", "logo", "big_pic", "brand_story", "sort"]).
			then(() => { notification.success({ message: "保存成功" }); formRef.current?.resetFields(); })
			.catch((e) => notification.error(e))

		handleClose();
		return true
	}
};

pageManager.register('product.brand.edit', {
	page: {
		view: [{ kind: 'form', ...editForm }],
		container: {
			keepAlive: false,
		}
	},
	stores: [],
});