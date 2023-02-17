import { DescriptionsProps } from '@/dynamic-components';
import {
  album_pics,
  brand_name,
  delete_status, details,
  keywords, name, new_status, note, preview_status, product_category_name,
  product_sn, recommand_status,
  service_ids,
  sort,
  sub_title,
  weight
} from './columns';

export const detail: DescriptionsProps = {
  modal: 'Drawer',
  bordered: true,
  columns: [
    product_category_name,
    brand_name,
    name,
    product_sn,
    delete_status,
    new_status,
    recommand_status,
    sub_title,

    weight,
    preview_status,
    service_ids,
    keywords,
    note,
    sort,
    album_pics,
    details,
  ] as DescriptionsProps['columns'],
  layout: 'horizontal'
}