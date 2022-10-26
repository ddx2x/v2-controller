import { BetaSchemaForm, StepFormProps, SubmitterProps } from '@ant-design/pro-components';
import { Drawer, Form as AntdForm, FormInstance, Modal } from 'antd';
import Button, { ButtonType } from 'antd/lib/button';
import React, { useState } from 'react';
import { IntlShape } from 'react-intl';
import { Columns, waitTime } from './tools';

export interface StepFormConfig {
  initialValue?: any;
  title?: string;
  modal: 'Modal' | 'Drawer' | 'Form';
  layoutType?: 'StepForm' | 'StepsForm';
  steps?: StepFormProps[];
  trigger?: string | React.ReactNode;
  triggerButtonType?: ButtonType;
  submitter?: SubmitterProps;
  submitTimeout?: number; // 提交数据时，禁用取消按钮的超时时间（毫秒）。
  columns?: Columns;
  onFinish?: (form: FormInstance<any> | undefined, values: any) => boolean;
  intl?: IntlShape; // 国际化
}

export const StepForm: React.FC<StepFormConfig> = (props) => {
  const [form] = AntdForm.useForm();

  const {
    modal,
    layoutType,
    columns,
    trigger,
    triggerButtonType,
    submitTimeout,
    onFinish,
    ...rest
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const triggerDom = (): any => {
    if (trigger instanceof Object) {
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

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const stepsForm = () => (
    <BetaSchemaForm
      form={form}
      layoutType={layoutType}
      autoFocusFirstInput
      // @ts-ignore
      columns={columns}
      onFinish={async (values) => {
        if (!onFinish) return false;
        await waitTime(submitTimeout);
        return onFinish(form, values);
      }}
      {...rest}
    />
  );

  switch (modal) {
    case 'Modal':
      return (
        <>
          {triggerDom()}
          <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            {stepsForm()}
          </Modal>
        </>
      );
    case 'Drawer':
      return (
        <>
          {triggerDom()}
          <Drawer title="Basic Drawer" placement="right" onClose={handleCancel} open={isModalOpen}>
            {stepsForm()}
          </Drawer>
        </>
      );
    case 'Form':
    default:
      return stepsForm();
  }
};

StepForm.defaultProps = {
  title: '新建',
  modal: 'Form',
  layoutType: 'StepForm',
  steps: [],
  columns: [],
  trigger: '新增',
  triggerButtonType: 'link',
  submitter: {
    searchConfig: {
      submitText: '确认',
      resetText: '取消',
    },
  },
  submitTimeout: 2000,
};

export default StepForm;

export const useStepsForm = (props: StepFormConfig): [any, {}] => {
  return [<StepForm {...props} />, {}];
};
