import { DescriptionsProps } from '@/dynamic-components';
import {
  brand_name,
  delete_status,
  name,
  new_status,
  product_category_name,
  product_sn,
  recommand_status,
  sort
} from './columns';

export const detail: DescriptionsProps = {
  modal: 'Modal',
  columns: [
    name,
    brand_name,
    product_category_name,
    product_sn,
    delete_status,
    new_status,
    recommand_status,
    sort,
  ] as DescriptionsProps['columns']
}