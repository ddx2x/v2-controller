import {
  ProDescriptions,
  ProDescriptionsItemProps,
  ProDescriptionsProps
} from '@ant-design/pro-components';
import { Button, Drawer, Modal } from 'antd';
import { ButtonSize, ButtonType } from 'antd/lib/button';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { IntlShape } from 'react-intl';

export declare type DescriptionsItem = ProDescriptionsItemProps & {
  value?: any;
}

// https://next-procomponents.ant.design/components/descriptions

export declare type DescriptionsProps = ProDescriptionsProps & {
  modal?: 'Modal' | 'Drawer' | 'Page';
  title?: string;
  triggerText?: string;
  triggerButtonType?: ButtonType;
  triggerButtonSize?: ButtonSize;
  width?: string | number;
  items?: DescriptionsItem[]; // 自定义类型
  intl?: IntlShape;
}

export const Descriptions: React.FC<DescriptionsProps> = observer((props) => {

  const {
    title,
    modal,
    width,
    triggerText,
    triggerButtonSize,
    triggerButtonType,
    items,
    dataSource,
    ...rest
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log('dataSource', dataSource);

  const triggerDom = () => {
    return (
      <Button size={triggerButtonSize} type={triggerButtonType} block onClick={showModal}>
        {triggerText}
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
      <ProDescriptions dataSource={dataSource} {...rest}>
        {items && items.map((item) => {
          const { value, valueType, dataIndex, key, ...rest } = item;
          let dKey = dataIndex || key || ''
          return (
            <ProDescriptions.Item valueType={valueType || 'text'} {...rest}>{
              value ?
                value :
                (dataSource && dKey ? dataSource[String(dKey)] : '')
            }</ProDescriptions.Item>
          );
        })}
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
});

Descriptions.defaultProps = {
  modal: 'Page',
  triggerText: '详情',
  triggerButtonType: 'link',
  triggerButtonSize: 'small',
  title: '详情信息',
  column: 2,
  width: '48%',
};

export const useDescriptions = (props: DescriptionsProps) => {
  return [<Descriptions {...props} />];
};
