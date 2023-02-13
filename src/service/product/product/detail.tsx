import { DescriptionsProps } from '@/dynamic-components';
import {
  album_pics,
  brand_name, delete_status, keywords, name, new_status, note, preview_status, product_category_name,
  product_sn, recommand_status,
  service_ids,
  sort,
  sub_title,
  unit,
  weight
} from './columns';

export const detail: DescriptionsProps = {
  modal: 'Drawer',
  columns: [
    product_category_name,
    brand_name,
    name,
    product_sn,
    delete_status,
    new_status,
    recommand_status,
    sub_title,
    unit,
    weight,
    preview_status,
    service_ids,
    keywords,
    note,
    album_pics,
    sort,
  ] as DescriptionsProps['columns']
}