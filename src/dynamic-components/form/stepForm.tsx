import { BetaSchemaForm, FooterToolbar, ProProvider } from '@ant-design/pro-components';
import { FormSchema } from '@ant-design/pro-form/es/components/SchemaForm';
import { Drawer, Form as AntdForm, FormInstance, Modal, Space } from 'antd';
import Button, { ButtonType } from 'antd/lib/button';
import React, { useContext, useState } from 'react';
import { IntlShape } from 'react-intl';
import { FormColumnsType } from '.';

import { waitTime } from './tools';
import { valueTypeMapStore } from './valueTypeMap';

export type StepFormProps = {
  columns?: FormColumnsType;
  modal?: 'Modal' | 'Drawer' | 'Form';
  width?: string | number;
  triggerText?: string;
  triggerButtonType?: ButtonType;
  submitTimeout?: number; // 提交数据时，禁用取消按钮的超时时间（毫秒）。
  onFinish?: (form: FormInstance<any> | undefined, values: any, handleClose: () => void) => boolean;
  intl?: IntlShape; // 国际化
} & Omit<FormSchema, 'columns'>;

export const StepForm: React.FC<StepFormProps> = (props) => {
  const [form] = AntdForm.useForm();
  const {
    title,
    columns,
    modal,
    triggerText,
    triggerButtonType,
    submitTimeout,
    onFinish,
    width,
    ...rest
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const triggerDom = () => {
    return (
      <Button type={triggerButtonType} onClick={showModal}>
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
            <FooterToolbar>{submitter}</FooterToolbar>
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
          columns={columns as any}
          autoFocusFirstInput
          layoutType="StepsForm"
          stepsFormRender={stepsFormRender}
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
};

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

export default StepForm;
