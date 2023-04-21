import {
  ActionType,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProDescriptionsProps,
  RouteContextType
} from '@ant-design/pro-components';
import { useLocation } from '@umijs/max';
import { Button, Drawer, Modal } from 'antd';
import { ButtonSize, ButtonType } from 'antd/lib/button';
import { parse } from 'querystring';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { IntlShape } from 'react-intl';

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
}

export const Descriptions = forwardRef((props: DescriptionsProps, forwardRef) => {
  const {
    columns,
    title,
    modal,
    width,
    triggerText,
    buttonSize,
    buttonType,
    params,
    request,
    ...rest
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true); return () => setMounted(false) }, [])

  const actionRef = useRef<ActionType>();


  useImperativeHandle(forwardRef, () => { return { open: () => { showModal() } } });



  const showModal = () => { setIsModalOpen(true) };
  const handleClose = () => { setIsModalOpen(false) };

  const triggerDom = () => {
    return (
      <Button size={buttonSize} type={buttonType} onClick={showModal}>
        {triggerText}
      </Button>
    );
  };

  const query = parse(useLocation()?.search.split('?')[1] || '')

  const Page = () => {
    if (!mounted) return null

    return (
      <ProDescriptions
        params={{ ...params, ...query }}
        actionRef={actionRef}
        // @ts-ignore
        columns={columns}
        request={request}
        {...rest}
      />
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
  bordered: true,
  column: 1,
  width: '60%',
  layout: 'horizontal',
  labelStyle: {
    width: '18%'
  },
  contentStyle: {
    width: '82%'
  }
};

export const useDescriptions = (props: DescriptionsProps): React.ReactNode => {
  return <Descriptions {...props} />;
};
