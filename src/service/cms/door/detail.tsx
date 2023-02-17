import { DescriptionsProps } from '@/dynamic-components';
import { address, bmap, first_name, logo, online_store_status, region_name, second_name, store_status } from './columns';

export const detail: DescriptionsProps = {
  modal: 'Drawer',
  columns: [
    first_name,
    second_name,
    logo,
    region_name,
    address,
    store_status,
    online_store_status,
    bmap,
  ] as DescriptionsProps['columns']
}

