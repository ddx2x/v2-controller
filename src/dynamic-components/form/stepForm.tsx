import type { ProFormInstance, RouteContextType } from '@ant-design/pro-components';
import { BetaSchemaForm, ProProvider } from '@ant-design/pro-components';
import type { FormSchema } from '@ant-design/pro-form/es/components/SchemaForm';
import { Affix, Drawer, Form as AntdForm, FormInstance, Modal, Space } from 'antd';
import type { ButtonType } from 'antd/lib/button';
import Button from 'antd/lib/button';
import type { Location } from 'history';
import { observer } from 'mobx-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import type { IntlShape } from 'react-intl';
import { FooterToolbar } from '../footer';
import { waitTime } from '../helper/wait';
import { RouterHistory } from '../router';
import { valueTypeMapStore } from './valueTypeMap';

export declare type StepFormProps = Omit<FormSchema, 'layoutType'> & {
  modal?: 'Modal' | 'Drawer' | 'Form';
  width?: string | number;
  triggerText?: string;
  triggerButtonType?: ButtonType;
  submitTimeout?: number; // 提交数据时，禁用取消按钮的超时时间（毫秒）。
  onFinish?: (
    form: FormInstance<unknown> | undefined,
    values: any,
    handleClose: () => void,
  ) => boolean;
  intl?: IntlShape; // 国际化
  routeContext?: RouteContextType;
} & RouterHistory & {
    mount?: (
      location: Location | undefined,
      formRef: React.MutableRefObject<ProFormInstance | undefined>,
    ) => void;
    unMount?: (
      location: Location | undefined,
      formRef: React.MutableRefObject<ProFormInstance | undefined>,
    ) => void;
  };

export const StepForm: React.FC<StepFormProps> = observer((props) => {
  const {
    location,
    mount,
    unMount,
    title,
    modal,
    triggerText,
    triggerButtonType,
    submitTimeout,
    onFinish,
    width,
    //
    routeContext,
    ...rest
  } = props;
  // ref
  const [form] = AntdForm.useForm();
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    formRef && mount && mount(location, formRef);
    return () => formRef && unMount && unMount(location, formRef);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const triggerDom = () => {
    return (
      <Button type={triggerButtonType} onClick={showModal}>
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
          // @ts-ignore
          form={form}
          // @ts-ignore
          stepsFormRender={stepsFormRender}
          autoFocusFirstInput
          layoutType="StepsForm"
          onFinish={async (values) => {
            if (!onFinish) return false;
            await waitTime(submitTimeout);
            return onFinish(form, values, handleClose);
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
  triggerButtonType: 'link',
  steps: [],
  columns: [],
  submitter: {
    searchConfig: {
      submitText: '确认',
      resetText: '取消',
    },
  },
  size: 'small',
  submitTimeout: 2000,
  width: '50%',
};

export const useStepsForm = (props: StepFormProps): [React.ReactNode, {}] => {
  return [<StepForm {...props} />, {}];
};
