import { IObject, ObjectApi, ObjectStore } from '@/client';
import { DefaultWatchApi, WatchApi } from '@/client/event';

export class Product extends IObject {
  name: string | undefined;
  brand_name: string | undefined;
  product_category_name: string | undefined;

  product_sn: string | undefined;
  product_price_sn: string | undefined;

  delete_status: number | string | undefined;
  publish_status: number | boolean | undefined;
  new_status: number | boolean | undefined;
  recommand_status: number | boolean | undefined;
  verify_status: number | boolean | string | undefined;
  sort: number | string | undefined;

  feight_template_id: string | undefined;

  price: number | string | undefined;
  promotion_price: number | string | undefined;
  gift_growth: number | string | undefined;
  gift_point: number | string | undefined;
  use_point_limit: string | undefined | number;
  sub_title: string | undefined | number;
  description: string | undefined | number;
  original_price: string | undefined | number;
  stock: string | undefined | number;
  low_stock: string | undefined | number;
  unit: string | undefined | number;
  weight: string | undefined | number;
  preview_status: string | undefined | number;
  service_ids: string | undefined | number;
  keywords: string[] | undefined;
  note: string | undefined | number;
  album_pics: string[] | any | undefined;
  album_pic: object | undefined;

  promotion_start_time: string | undefined | number;
  promotion_end_time: string | undefined | number;
  promotion_per_limit: string | undefined | number;
  promotion_type: string[] | number[] | undefined;

  details: string | undefined;

  pic: object | undefined;

  constructor(data: Product) {
    super(data);
    Object.assign(this, data);
    this.delete_status = String(this.delete_status);
    this.publish_status = this.publish_status === 1 ? true : false;
    this.new_status = this.new_status === 1 ? true : false;
    this.recommand_status = this.recommand_status === 1 ? true : false;
    this.verify_status = this.verify_status === 1 ? true : false;
    this.sort = String(this.sort);
    this.keywords = this.keywords || [];

    this.album_pic =
      this.album_pics && this.album_pics?.length > 0
        ? {
            fileList: [{ url: '/media-t/file/' + this.album_pics[0], name: this.album_pics[0] }],
          }
        : {};

    this.album_pics =
      this.album_pics && this.album_pics?.length > 0
        ? {
            fileList: this.album_pics.map((album_pic: string) => {
              return { url: '/media-t/file/' + album_pic, name: album_pic };
            }),
          }
        : {};
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

export const productApi = new ObjectApi<Product>({
  url: '/api/v1/product',
  objectConstructor: Product,
  service: 'product-t',
});

export const productStore = new ProductStore(productApi, new DefaultWatchApi());
