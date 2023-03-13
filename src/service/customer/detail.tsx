import { DescriptionsProps } from '@/dynamic-components';
import { customerAddresses, name } from './columns';

export const detail: DescriptionsProps = {
  modal: 'Drawer',
  bordered: true,
  columns: [
    name,
    customerAddresses,
  ] as DescriptionsProps['columns'],  
  layout: 'horizontal'
}