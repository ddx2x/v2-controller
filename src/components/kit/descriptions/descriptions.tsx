import {
  DrawerForm,
  ModalForm,
  ProDescriptions,
  ProDescriptionsProps,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import { IntlShape } from 'react-intl';
import { DescriptionsItem, descriptionsItems } from './items';

interface DescriptionsProps extends ProDescriptionsProps {
  modal?: 'modal' | 'drawer' | 'page';
  title?: string;
  trigger?: string | React.ReactNode;
  items?: DescriptionsItem[];
  intl?: IntlShape;
}

export interface DescriptionsLayout extends DescriptionsProps {}

export const Descriptions: React.FC<DescriptionsProps> = (props) => {
  const { title, modal, trigger, items, ...rest } = props;

  const triggerDom = (): any => {
    if (trigger instanceof Object) {
      return trigger;
    }
    return <Button type="primary">{trigger}</Button>;
  };

  const Page = () => {
    return (
      <ProDescriptions {...rest}>
        {descriptionsItems(items)}
        {props.children}
      </ProDescriptions>
    );
  };

  const Modal = () => {
    return (
      <ModalForm title={title} trigger={triggerDom()}>
        {Page()}
      </ModalForm>
    );
  };

  const Drawer = () => {
    return (
      <DrawerForm title={title} trigger={triggerDom()}>
        {Page()}
      </DrawerForm>
    );
  };

  switch (modal) {
    case 'modal':
      return Modal();
    case 'drawer':
      return Drawer();
    case 'page':
    default:
      return Page();
  }
};

Descriptions.defaultProps = {
  modal: 'page',
  trigger: '查看',
  title: '详情',
  column: 1,
};

export default Descriptions;

export const useDescriptions = (props: DescriptionsProps) => {
  return [<Descriptions {...props} />];
};
