import {
  DrawerForm,
  ModalForm,
  ProDescriptions,
  ProDescriptionsProps,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import { DescriptionsItem, DescriptionsItems } from './items';

interface DescriptionsProps extends ProDescriptionsProps {
  modal?: 'modal' | 'drawer' | 'page';
  title?: string;
  trigger?: string | React.ReactNode;
  items?: DescriptionsItem[];
}

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
        {props.children}
        <DescriptionsItems items={items} />
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
};

export default Descriptions;

export const useDescriptions = (props: DescriptionsProps) => {
  return [<Descriptions {...props} />];
};
