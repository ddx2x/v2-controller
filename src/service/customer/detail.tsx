import { DescriptionsProps } from '@/dynamic-components';
import { name } from './columns';

export const detail: DescriptionsProps = {
  modal: 'Drawer',
  bordered: true,
  columns: [
    name,

  ] as DescriptionsProps['columns'],
  layout: 'horizontal'
}