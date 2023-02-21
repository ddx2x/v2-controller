import type { ProFormInstance, RouteContextType } from '@ant-design/pro-components';
import { BetaSchemaForm, ProProvider } from '@ant-design/pro-components';
import type { FormSchema } from '@ant-design/pro-form/es/components/SchemaForm';
import { useLocation } from '@umijs/max';
import { Drawer, Modal, Space } from 'antd';
import type { ButtonType } from 'antd/lib/button';
import Button from 'antd/lib/button';
import type { Location } from 'history';
import React, { Dispatch, useContext, useRef, useState } from 'react';
import type { IntlShape } from 'react-intl';
import { waitTime } from '../../helper/wait';
import { FooterToolbar } from '../footer';
import { valueTypeMapStore } from '../valueType/valueTypeMap';

export declare type StepFormProps = Omit<FormSchema, 'layoutType'> & {
  onMount?: (params: {
    location: Location | undefined,
    form: ProFormInstance | undefined,
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

export const StepForm: React.FC<StepFormProps> = (props) => {
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
    ...rest
  } = props;

  const location = useLocation()
  const formRef = useRef<ProFormInstance>();
  const [_columns, setColumns] = useState<FormSchema['columns']>(columns)
  const [dataObject, setDataObject] = useState([])


  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleShow = () => { setIsModalOpen(true) };
  const handleClose = () => { setIsModalOpen(false) };

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
          // @ts-ignore
          columns={_columns}
          onInit={(values, form) => onMount && onMount({ location, form, setDataObject, columns: _columns, setColumns })}
          stepsFormRender={stepsFormRender}
          autoFocusFirstInput
          layoutType="StepsForm"
          onFinish={async (values) => {
            if (!onSubmit) return false;
            await waitTime(submitTimeout);
            return onSubmit({ formRef, values, dataObject, handleClose });
          }}
          isKeyPressSubmit={true}
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
