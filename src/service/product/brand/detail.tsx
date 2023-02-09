import { DescriptionsProps } from '@/dynamic-components';
import {
  brand_story, factory_status, first_letter, logo, name, show_status,
  sort
} from './columns';

export const detail: DescriptionsProps = {
  modal: 'Drawer',
  columns: [
    logo,
    brand_story,
    factory_status,
    first_letter,
    name,
    show_status,
    sort
  ]
}

