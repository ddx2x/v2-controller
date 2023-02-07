import type { ProFormInstance, RouteContextType } from '@ant-design/pro-components';
import { BetaSchemaForm, ProProvider } from '@ant-design/pro-components';
import type { FormSchema } from '@ant-design/pro-form/es/components/SchemaForm';
import { Drawer, Modal, Space } from 'antd';
import type { ButtonType } from 'antd/lib/button';
import Button from 'antd/lib/button';
import type { Location } from 'history';
import { delay } from 'lodash';
import React, { Dispatch, useContext, useEffect, useRef, useState } from 'react';
import type { IntlShape } from 'react-intl';
import { FooterToolbar } from '../footer';
import { waitTime } from '../helper/wait';
import { RouterHistory } from '../router';
import { valueTypeMapStore } from '../valueType/valueTypeMap';

export declare type StepFormProps = Omit<FormSchema, 'layoutType'> & {
  onMount?: (location: Location | undefined, formRef: React.MutableRefObject<ProFormInstance | undefined>, setDataObject: Dispatch<any>) => void;
  unMount?: (location: Location | undefined, formRef: React.MutableRefObject<ProFormInstance | undefined>) => void;
  modal?: 'Modal' | 'Drawer' | 'Form';
  width?: string | number;
  triggerText?: string;
  buttonType?: ButtonType;
  submitTimeout?: number; // 提交数据时，禁用取消按钮的超时时间（毫秒）。
  onSubmit?: (formRef: React.MutableRefObject<ProFormInstance | undefined>, values: any, dataObject: any, handleClose: () => void) => boolean;
  intl?: IntlShape; // 国际化
  routeContext?: RouteContextType;
} & RouterHistory;

export const StepForm: React.FC<StepFormProps> = (props) => {
  const {
    location,
    onMount,
    unMount,
    title,
    modal,
    triggerText,
    buttonType,
    submitTimeout,
    onSubmit,
    width,
    routeContext,
    ...rest
  } = props;

  const [dataObject, setDataObject] = useState([])
  const formRef = useRef<ProFormInstance>();
  const init = () => {
    delay(() => formRef && onMount && onMount(location, formRef, setDataObject), 10);
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleShow = () => { setIsModalOpen(true); init() };
  const handleClose = () => { setIsModalOpen(false) };

  useEffect(() => {
    modal == 'Form' && init()
    return () => formRef && unMount && unMount(location, formRef);
  }, []);

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
      <ProProvider.Provider
        value={{
          ...useContext(ProProvider),
          valueTypeMap: valueTypeMapStore.stores
        }}
      >
        <BetaSchemaForm
          // @ts-ignore
          formRef={formRef}
          stepsFormRender={stepsFormRender}
          autoFocusFirstInput
          layoutType="StepsForm"
          onFinish={async (values) => {
            if (!onSubmit) return false;
            await waitTime(submitTimeout);
            return onSubmit(formRef, values, dataObject, handleClose);
          }}
          {...rest}
        />
      </ProProvider.Provider>
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
};

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

export const useStepsForm = (props: StepFormProps): [React.ReactNode, {}] => {
  return [<StepForm {...props} />, {}];
};
