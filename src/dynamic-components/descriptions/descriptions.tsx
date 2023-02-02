import {
  ActionType,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProDescriptionsProps,
  ProProvider,
  RouteContextType
} from '@ant-design/pro-components';
import { Button, Drawer, Modal } from 'antd';
import { ButtonSize, ButtonType } from 'antd/lib/button';
import type { Location } from 'history';
import React, { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { IntlShape } from 'react-intl';
import { RouterHistory } from '../router';
import { valueTypeMapStore } from '../valueType';

export declare type DescriptionsRef = {
  open: () => void;
};

export declare type DescriptionsItem = ProDescriptionsItemProps & {
  value?: any;
};

// https://next-procomponents.ant.design/components/descriptions

export declare type DescriptionsProps = ProDescriptionsProps & {
  modal?: 'Modal' | 'Drawer' | 'Page';
  title?: string;
  triggerText?: string;
  buttonType?: ButtonType;
  buttonSize?: ButtonSize;
  width?: string | number;
  items?: DescriptionsItem[]; // 自定义类型
  intl?: IntlShape;
  routeContext?: RouteContextType;
} & RouterHistory & {
  onMount?: (location: Location | undefined, actionRef: React.MutableRefObject<ActionType | undefined>) => void;
  unMount?: (location: Location | undefined, actionRef: React.MutableRefObject<ActionType | undefined>) => void;
};

export const Descriptions = React.forwardRef((props: DescriptionsProps, forwardRef) => {
  const {
    location,
    onMount,
    unMount,
    title,
    modal,
    width,
    triggerText,
    buttonSize,
    buttonType,
    items,
    dataSource,
    ...rest
  } = props;

  useImperativeHandle(forwardRef, () => {
    return {
      open: () => showModal(),
    };
  });

  // ref
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    actionRef && onMount && onMount(location, actionRef);
    return () => actionRef && unMount && unMount(location, actionRef);
  }, []);

  const proProviderValues = useContext(ProProvider);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setIsModalOpen(false);
  };

  const triggerDom = () => {
    return (
      <Button size={buttonSize} type={buttonType} onClick={showModal}>
        {triggerText}
      </Button>
    );
  };

  const Page = () => {
    return (
      <ProProvider.Provider
        value={{
          ...proProviderValues,
          valueTypeMap: valueTypeMapStore.stores,
        }}
      >
        <ProDescriptions actionRef={actionRef} dataSource={dataSource} {...rest}>
          {items &&
            items.map((item) => {
              const { value, valueType, dataIndex, key, ...rest } = item;
              const dKey = dataIndex || key || '';
              return (
                <ProDescriptions.Item valueType={valueType || 'text'} {...rest}>
                  {value ? value : dataSource && dKey ? dataSource[String(dKey)] : ''}
                </ProDescriptions.Item>
              );
            })}
          {props.children}
        </ProDescriptions>
      </ProProvider.Provider>
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
}
);

Descriptions.defaultProps = {
  modal: 'Page',
  triggerText: '详情',
  buttonType: 'link',
  buttonSize: 'small',
  title: '详情信息',
  column: 2,
  width: '48%',
};

export const useDescriptions = (props: DescriptionsProps): React.ReactNode => {
  return <Descriptions {...props} />;
};
