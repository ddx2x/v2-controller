import {
  DrawerForm as Drawer,
  ModalForm as Modal,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProDescriptionsProps,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import React from 'react';
import { IntlShape } from 'react-intl';

export interface DescriptionsItem extends ProDescriptionsItemProps {
  value?: React.ReactNode | null | undefined;
}

export const descriptionsItems = (items: DescriptionsItem[] | undefined) => {
  if (!items) return null;
  return (
    <>
      {items.map((item) => {
        const { value, ...rest } = item;
        return <ProDescriptions.Item {...rest}>{value}</ProDescriptions.Item>;
      })}
    </>
  );
};

// https://next-procomponents.ant.design/components/descriptions

export interface DescriptionsProps extends ProDescriptionsProps {
  modal?: 'modal' | 'drawer' | 'page';
  title?: string;
  trigger?: string | React.ReactNode;
  items?: DescriptionsItem[];
  intl?: IntlShape;
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
        {descriptionsItems(items)}
        {props.children}
      </ProDescriptions>
    );
  };

  switch (modal) {
    case 'modal':
      return (
        <Modal title={title} trigger={triggerDom()}>
          {Page()}
        </Modal>
      );
    case 'drawer':
      return (
        <Drawer title={title} trigger={triggerDom()}>
          {Page()}
        </Drawer>
      );
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
