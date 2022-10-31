import {
  BetaSchemaForm,
  FooterToolbar,
  StepFormProps as ProStepFormProps,
  SubmitterProps,
} from '@ant-design/pro-components';
import { Drawer, Form as AntdForm, FormInstance, Modal, Space, StepsProps } from 'antd';
import Button, { ButtonType } from 'antd/lib/button';
import React, { useState } from 'react';
import { IntlShape } from 'react-intl';
import { Columns, waitTime } from './tools';

export interface StepFormProps {
  title?: string;
  modal: 'Modal' | 'Drawer' | 'Form';
  layoutType?: 'StepsForm';
  initialValue?: any;
  width?: string | number;
  steps?: ProStepFormProps[];
  stepsProps?: StepsProps; // 多表单参数
  trigger?: string | React.ReactNode;
  triggerButtonType?: ButtonType;
  submitter?: SubmitterProps;
  submitTimeout?: number; // 提交数据时，禁用取消按钮的超时时间（毫秒）。
  columns?: Columns;
  onFinish?: (form: FormInstance<any> | undefined, values: any, handleClose: () => void) => boolean;
  intl?: IntlShape; // 国际化
}

export const StepForm: React.FC<StepFormProps> = (props) => {
  const [form] = AntdForm.useForm();

  const {
    title,
    modal,
    columns,
    trigger,
    triggerButtonType,
    submitTimeout,
    onFinish,
    width,
    stepsProps,
    ...rest
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const triggerDom = (): any => {
    if (trigger instanceof Object) {
      trigger['onClick'] = showModal;
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

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const stepsFormRender = (dom: any, submitter: any) => {
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
      <BetaSchemaForm
        form={form}
        autoFocusFirstInput
        stepsProps={{
          // @ts-ignore
          size: 'small',
          ...stepsProps,
        }}
        // @ts-ignore
        columns={columns}
        stepsFormRender={stepsFormRender}
        onFinish={async (values) => {
          if (!onFinish) return false;
          await waitTime(submitTimeout);
          return onFinish(form, values, handleClose);
        }}
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
};

StepForm.defaultProps = {
  title: '新建',
  modal: 'Form',
  layoutType: 'StepsForm',
  steps: [],
  columns: [],
  stepsProps: { direction: 'horizontal' },
  trigger: '新增',
  triggerButtonType: 'link',
  submitter: {
    searchConfig: {
      submitText: '确认',
      resetText: '取消',
    },
  },
  submitTimeout: 2000,
  width: '50%',
};

export default StepForm;

export const useStepsForm = (props: StepFormProps): [any, {}] => {
  return [<StepForm {...props} />, {}];
};
