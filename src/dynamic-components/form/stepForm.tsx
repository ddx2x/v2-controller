import type { ProFormInstance, RouteContextType } from '@ant-design/pro-components';
import { BetaSchemaForm, ProProvider } from '@ant-design/pro-components';
import type { FormSchema } from '@ant-design/pro-form/es/components/SchemaForm';
import { Drawer, Modal, Space } from 'antd';
import type { ButtonType } from 'antd/lib/button';
import Button from 'antd/lib/button';
import type { Location } from 'history';
import { observer } from 'mobx-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import type { IntlShape } from 'react-intl';
import { FooterToolbar } from '../footer';
import { waitTime } from '../helper/wait';
import { RouterHistory } from '../router';
import { valueTypeMapStore } from '../valueType/valueTypeMap';

export declare type StepFormProps = Omit<FormSchema, 'layoutType'> & {
  modal?: 'Modal' | 'Drawer' | 'Form';
  width?: string | number;
  triggerText?: string;
  buttonType?: ButtonType;
  submitTimeout?: number; // 提交数据时，禁用取消按钮的超时时间（毫秒）。
  onFinish?: (formRef: React.MutableRefObject<ProFormInstance | undefined>, values: any, handleClose: () => void) => boolean;
  intl?: IntlShape; // 国际化
  routeContext?: RouteContextType;
} & RouterHistory & {
  onMount?: (location: Location | undefined, formRef: React.MutableRefObject<ProFormInstance | undefined>) => void;
  unMount?: (location: Location | undefined, formRef: React.MutableRefObject<ProFormInstance | undefined>) => void;
};

export const StepForm: React.FC<StepFormProps> = observer((props) => {
  const {
    location,
    onMount,
    unMount,
    title,
    modal,
    triggerText,
    buttonType,
    submitTimeout,
    onFinish,
    width,
    //
    routeContext,
    ...rest
  } = props;

  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    formRef && onMount && onMount(location, formRef);
    return () => formRef && unMount && unMount(location, formRef);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const triggerDom = () => {
    return (
      <Button type={buttonType} onClick={showModal}>
        {triggerText}
      </Button>
    );
  };

  const handleClose = () => {
    setIsModalOpen(false);
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
          valueTypeMap: valueTypeMapStore.stores,
        }}
      >
        <BetaSchemaForm
          // @ts-ignore
          formRef={formRef}
          stepsFormRender={stepsFormRender}
          autoFocusFirstInput
          layoutType="StepsForm"
          onFinish={async (values) => {
            if (!onFinish) return false;
            await waitTime(submitTimeout);
            return onFinish(formRef, values, handleClose);
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

export const useStepsForm = (props: StepFormProps): [React.ReactNode, {}] => {
  return [<StepForm {...props} />, {}];
};
