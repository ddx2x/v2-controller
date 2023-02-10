import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

interface ImageFileList {
	fileList: [{
		url: string; name: string | object | undefined;
	}],
};

export class Brand extends IObject {
	first_letter: string | undefined
	sort: number | string | undefined
	factory_status: number | string | undefined
	product_count: number | string | undefined
	product_comment_count: number | string | undefined
	show_status: number | string | undefined
	logo: string | object | undefined
	big_pic: string | object | undefined
	brand_story: string | undefined

	constructor(data: Brand) {
		super(data);
		Object.assign(this, data);
		// this.logo_price = '/media-t/file/' + this.logo
		this.logo = {
			fileList: [{
				url: '/media-t/file/' + this.logo, name: this.logo
			}]
		}
	}
}

class BrandStore extends ObjectStore<Brand> {
	watchApi: WatchApi<Brand>;
	api: ObjectApi<Brand>;
	constructor(api: ObjectApi<Brand>, watchApi: WatchApi<Brand>) {
		super();
		this.api = api;
		this.watchApi = watchApi;
	}

}


export const brandApi = new ObjectApi<Brand>(
	{
		url: '/api/v1/brand',
		objectConstructor: Brand,
		service: 'product-t',
	}
);

export const brandStore = new BrandStore(brandApi, new DefaultWatchApi());

