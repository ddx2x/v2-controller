import {
  ProDescriptions,
  ProDescriptionsItemProps,
  ProDescriptionsProps,
} from '@ant-design/pro-components';
import { Button, Drawer, Modal } from 'antd';
import { ButtonType } from 'antd/lib/button';
import React, { useState } from 'react';
import { IntlShape } from 'react-intl';

export interface DescriptionsItem extends ProDescriptionsItemProps {
  value?: React.ReactNode | null | undefined;
}

export const DescriptionsItems = (props: { items: DescriptionsItem[] | undefined }) => {
  const { items } = props;
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
  modal?: 'Modal' | 'Drawer' | 'Page';
  title?: string;
  trigger?: string | React.ReactNode;
  triggerButtonType?: ButtonType;
  width?: string | number;
  items?: DescriptionsItem[];
  intl?: IntlShape;
}

export const Descriptions: React.FC<DescriptionsProps> = (props) => {
  const { title, modal, width, trigger, items, triggerButtonType, ...rest } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const triggerDom = (): any => {
    if (trigger instanceof Object) {
      trigger['onClick'] = showModal;
      return trigger;
    }
    return (
      <Button type={triggerButtonType} onClick={showModal}>
        {trigger}
      </Button>
    );
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const Page = () => {
    return (
      <ProDescriptions {...rest}>
        <DescriptionsItems items={items} />
        {props.children}
      </ProDescriptions>
    );
  };

  switch (modal) {
    case 'Modal':
      return (
        <>
          {triggerDom()}
          <Modal
            title={title}
            width={width}
            onCancel={handleClose}
            open={isModalOpen}
            destroyOnClose
          >
            {Page()}
          </Modal>
        </>
      );
    case 'Drawer':
      return (
        <>
          {triggerDom()}
          <Drawer
            title={title}
            width={width}
            placement="right"
            onClose={handleClose}
            open={isModalOpen}
            destroyOnClose
          >
            {Page()}
          </Drawer>
        </>
      );
    case 'Page':
    default:
      return Page();
  }
};

Descriptions.defaultProps = {
  modal: 'Page',
  trigger: '查看',
  title: '详情',
  column: 1,
};

export default Descriptions;

export const useDescriptions = (props: DescriptionsProps) => {
  return [<Descriptions {...props} />];
};
