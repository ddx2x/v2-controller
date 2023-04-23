import { BetaSchemaForm, ProFormInstance, RouteContextType } from '@ant-design/pro-components';
import type { FormSchema } from '@ant-design/pro-form/es/components/SchemaForm';
import { useLocation } from '@umijs/max';
import { Drawer, Modal, Space } from 'antd';
import type { ButtonType } from 'antd/lib/button';
import Button from 'antd/lib/button';
import type { Location } from 'history';
import React, { Dispatch, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { IntlShape } from 'react-intl';
import { waitTime } from '../../helper/wait';
import { FooterToolbar } from '../footer';

export declare type StepFormProps = Omit<FormSchema, 'layoutType'> & {
  onMount?: (params: {
    location: Location | undefined,
    formMapRef: React.MutableRefObject<ProFormInstance<any> | undefined>[],
    setDataObject: Dispatch<any>,
    columns: FormSchema['columns'],
    setColumns: Dispatch<FormSchema['columns']>
  }) => void;
  modal?: 'Modal' | 'Drawer' | 'Form';
  width?: string | number;
  triggerText?: string;
  buttonType?: ButtonType;
  submitTimeout?: number; // 提交数据时，禁用取消按钮的超时时间（毫秒）。
  onSubmit?: (params: {
    formRef: React.MutableRefObject<ProFormInstance | undefined>,
    values: any,
    dataObject: any,
    handleClose: () => void
  }) => boolean;
  intl?: IntlShape; // 国际化
  routeContext?: RouteContextType;
}

export const StepForm = forwardRef((props: StepFormProps, forwardRef) => {

  const {
    onMount,
    columns,
    title,
    modal,
    triggerText,
    buttonType,
    submitTimeout,
    onSubmit,
    width,
    routeContext,
    request,
    ...rest
  } = props;


  const location = useLocation()
  const formRef = useRef<ProFormInstance>();
  const formMapRef = useRef<ProFormInstance[]>();
  const [_columns, setColumns] = useState<FormSchema['columns']>(columns)
  const [dataObject, setDataObject] = useState({})


  const [mounted, setMounted] = useState(false)
  const [_init, setInit] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleShow = () => { setIsModalOpen(true) };
  const handleClose = () => { setIsModalOpen(false) };

  useEffect(() => {
    setMounted(true)
  }, [])

  useImperativeHandle(forwardRef, () => {
    return {
      open: () => handleShow(),
    };
  });

  if (mounted && !_init) {
    setTimeout(() =>
      onMount && onMount({
        location,
        formMapRef: formMapRef.current as any,
        setDataObject,
        columns: _columns,
        setColumns
      }), 100)
    setInit(true)
  }

  const triggerDom = () => {
    return (
      <Button type={buttonType} onClick={handleShow}>
        {triggerText}
      </Button>
    );
  };

  const stepsFormRender = (dom: React.ReactNode, submitter: React.ReactNode) => {
    switch (modal) {
      case 'Modal':
        return (
          <Modal
            title={title}
            width={width}
            onCancel={handleClose}
            open={isModalOpen}
            footer={submitter}
            destroyOnClose
          >
            {dom}
          </Modal>
        );
      case 'Drawer':
        return (
          <Drawer
            title={title}
            width={width}
            placement="right"
            onClose={handleClose}
            open={isModalOpen}
            footer={<Space>{submitter}</Space>}
            destroyOnClose
          >
            {dom}
          </Drawer>
        );
      case 'Form':
      default:
        return (
          <>
            {dom}
            <FooterToolbar routeContext={routeContext || {}}>
              <Space>{submitter}</Space>
            </FooterToolbar>
          </>
        );
    }
  };

  const stepsForm = () => {
    return (
      <BetaSchemaForm
        layoutType="StepsForm"
        // @ts-ignore
        formRef={formRef}
        // @ts-ignore
        formMapRef={formMapRef}
        // @ts-ignore
        columns={_columns}
        stepsFormRender={stepsFormRender}
        autoFocusFirstInput
        onFinish={async (values) => {
          if (!onSubmit) return false;
          await waitTime(submitTimeout);
          return onSubmit({ formRef, values, dataObject, handleClose });
        }}
        isKeyPressSubmit={true}
        {...rest}
      />
    );
  };


  switch (modal) {
    case 'Modal':
    case 'Drawer':
      return (
        <>
          {triggerDom()}
          {stepsForm()}
        </>
      );
    case 'Form':
    default:
      return <>{stepsForm()}</>;
  }
});

StepForm.defaultProps = {
  title: '新建',
  modal: 'Form',
  triggerText: '新增',
  buttonType: 'link',
  steps: [],
  columns: [],
  submitter: {
    searchConfig: {
      submitText: '确认',
      resetText: '取消',
    },
  },
  submitTimeout: 2000,
};
