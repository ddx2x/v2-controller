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
import { delay } from 'lodash';
import  { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
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
  intl?: IntlShape;
  routeContext?: RouteContextType;
} & RouterHistory & {
  onMount?: (location: Location | undefined, actionRef: React.MutableRefObject<ActionType | undefined>) => void;
  unMount?: (location: Location | undefined, actionRef: React.MutableRefObject<ActionType | undefined>) => void;
};

export const Descriptions = forwardRef((props: DescriptionsProps, forwardRef) => {
  const {
    columns,
    location,
    onMount,
    unMount,
    title,
    modal,
    width,
    triggerText,
    buttonSize,
    buttonType,
    ...rest
  } = props;


  const actionRef = useRef<ActionType>();
  const init = () => {
    delay(() => actionRef && onMount && onMount(location, actionRef), 10);
  }

  useImperativeHandle(forwardRef, () => {
    return {
      open: () => showModal(),
    };
  });

  useEffect(() => {
    init()
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
        <ProDescriptions
          actionRef={actionRef}
          // @ts-ignore
          columns={columns}
          {...rest}
        />
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
});

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
