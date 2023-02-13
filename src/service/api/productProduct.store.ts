import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export class Product extends IObject {
    name: string | undefined
    brand_name: string | undefined
    product_category_name: string | undefined

    product_sn: string | undefined
    product_price_sn: string | undefined

    delete_status: number | string | undefined
    publish_status: number | string | undefined
    new_status: number | string | undefined
    recommand_status: number | string | undefined
    verify_status: number | string | undefined
    sort: number | string | undefined

    price: number | string | undefined
    promotion_price: number | string | undefined
    gift_growth: number | string | undefined
    gift_point: number | string | undefined
    use_point_limit: string | undefined | number
    sub_title: string | undefined | number
    description: string | undefined | number
    original_price: string | undefined | number
    stock: string | undefined | number
    low_stock: string | undefined | number
    unit: string | undefined | number
    weight: string | undefined | number
    preview_status: string | undefined | number
    service_ids: string | undefined | number
    keywords: string | undefined | number
    note: string | undefined | number
    album_pics: string[] | any | undefined

    promotion_start_time: string | undefined | number
    promotion_end_time: string | undefined | number
    promotion_per_limit: string | undefined | number
    promotion_type: string | undefined | number

    pic: object | undefined

    constructor(data: Product) {
        super(data);
        Object.assign(this, data);
        this.delete_status = String(this.delete_status);
        this.publish_status = String(this.publish_status);
        this.new_status = String(this.new_status);
        this.recommand_status = String(this.recommand_status);
        this.verify_status = String(this.verify_status);
        this.sort = String(this.sort);
        this.pic = this.album_pics && this.album_pics?.length > 0 ? {
            fileList: [{
                url: '/media-t/file/' + this.album_pics[0], name: this.album_pics[0]
            }]
        } : {};
    }
}

class ProductStore extends ObjectStore<Product> {
    watchApi: WatchApi<Product>;
    api: ObjectApi<Product>;
    constructor(api: ObjectApi<Product>, watchApi: WatchApi<Product>) {
        super();
        this.api = api;
        this.watchApi = watchApi;
    }
}

export const productApi = new ObjectApi<Product>(
    {
        url: '/api/v1/product',
        objectConstructor: Product,
        service: 'product-t',
    }
);

export const productStore = new ProductStore(productApi, new DefaultWatchApi());

